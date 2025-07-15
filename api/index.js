const express = require('express');
const { GoogleGenAI, createUserContent, createPartFromUri, Type } = require('@google/genai');
const fs = require("fs");
const jwt = require('jsonwebtoken');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');
const { Readable } = require('stream');

const cloudinary = require('cloudinary').v2;

const app = express();
app.use(cors({
  origin: ['http://localhost:3000', 'https://chikatayo.vercel.app'],
  credentials: true
}));
app.use(express.json({ limit: '100mb' }));

const url = 'mongodb+srv://raldincasidar:dindin23@accounting-system.haaem.mongodb.net/bmis-db?retryWrites=true&w=majority';
const dbName = 'chikatayo';
const jwt_secret = 'raldincasidar.studio$supersecret$k3y'

let db;

const CLOUDINARY_CLOUD_NAME="dvjthtzlp"
const CLOUDINARY_API_KEY="721299396763413"
const CLOUDINARY_API_SECRET="518JDdlYhr5jhCrI0CM5ALnYbUQ"


const GEMINI_API_KEY = 'AIzaSyAfdQbfiDCfRzks39OipdxtwRZ1GbnghqE'

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true, // Use https
});



app.get('/', async (req, res) => {
    const ress = await db.collection('users').find({}).toArray();
    res.json({ message: 'Hello World!', ress });
});


async function securityMiddleware(req, res, next) {
    const cookies = req.headers.cookie && req.headers.cookie.split(';').reduce((acc, cur) => {
        const [key, value] = cur.trim().split('=');
        acc[key] = value;
        return acc;
    }, {});
    const token = cookies['token'];

    // console.log('token', token);
    if (token) {
        try {
            const decoded = jwt.verify(token, jwt_secret);

            const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.id) });
            req.user = user;
            next();
        } catch (err) {
            // ignore
            console.error(err);
            res.status(401).json({ message: 'Please login again' });
            next();
        }
    }

}


app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and Password are required' });
    }

    const user = await db.collection('users').findOne({ email });

    if (!user) {
        return res.status(400).json({ message: 'Email is not found' });
    }

    if (password !== user.password) {
        return res.status(400).json({ message: 'Password is incorrect' });
    }

    res.json({ message: 'Login successfully!', token: generateToken(user) });
});


app.post('/api/users', async (req, res) => {
    const { firstName, middleName, lastName, email, password } = req.body;
    const user = {
        firstName,
        middleName,
        lastName,
        email,
        password
    };

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: 'First name, Last name, Email and Password are required' });
    }


    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Email is not valid' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Password should be at least 6 characters' });
    }



    

    const result = await db.collection('users').insertOne(user);
    res.json({ message: 'User created!', result, token: generateToken(user) });
});

app.get('/api/user', securityMiddleware, async (req, res) => {
    res.json({ message: 'User found!', user: req.user });
})

// update user info (with update password)
app.put('/api/user', securityMiddleware, async (req, res) => {
    const { firstName, middleName, lastName, email, password } = req.body;
    const user = {
        firstName,
        middleName,
        lastName,
        email,
        password
    };

    if (!firstName || !lastName || !email) {
        return res.status(400).json({ message: 'First name, Last name, Email are required' });
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Email is not valid' });
    }

    if (password) {
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password should be at least 6 characters' });
        }
    } else {
        delete user.password;
    }

    const result = await db.collection('users').updateOne({ _id: req.user._id }, { $set: user });
    res.json({ message: 'User updated!', result });
});

// request data deletion
app.post('/api/request-deletion', securityMiddleware, async (req, res) => {
    const { email } = req.body;
    const result = await db.collection('users').updateOne({ _id: req.user._id }, { $set: { email } });
    res.json({ message: 'Data deletion request sent!', result });
});



app.post('/api/diary', securityMiddleware, async (req, res) => {
  const { emotion, audio } = req.body;

  if (!emotion || !audio) {
    return res.status(400).json({ message: 'Emotion and Audio are required' });
  }

  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const destinationFolder = `${year}/${month}/${day}`;
  const filename = `${year}-${month}-${day}-${emotion}`;
  // res.status(400).json({ message: cleanDataUri(audio) });
  const uploadAudioResult = await uploadBase64Audio(cleanDataUri(audio), filename, req.user.email);

  console.log(uploadAudioResult.secure_url);
  const analysis = await analyzeAudio(cleanDataUri(audio));

  const result = await db.collection('diary').insertOne({
    emotion,
    audio: uploadAudioResult.secure_url,
    analysis: analysis[0],
    user: req.user._id,
    title: analysis[0]?.title || 'Your Diary', 
    date: analysis[0]?.date || new Date(),
  });
  res.json({ message: 'Diary created!', result: { emotion, audio: uploadAudioResult.secure_url, id: result.insertedId }, analysis: analysis[0],  user: req.user });
})



// add new diary

app.get('/api/diary', securityMiddleware, async (req, res) => {
  const limit = 10;
  const skip = req.query?.skip ? parseInt(req.query.skip) : 0;
  
  const diaries = await db.collection('diary').find({ user: new ObjectId(req.user._id) }, { skip, limit, sort: { date: -1 } }).toArray();
  const totalDiaries = await db.collection('diary').countDocuments({ user: new ObjectId(req.user._id) });
  res.json({ message: 'Diary is fetched!', diaries, total: totalDiaries });

})

// get diary by id

app.get('/api/diary/:id', securityMiddleware, async (req, res) => {
  const { id } = req.params;
  const diary = await db.collection('diary').findOne({ _id: new ObjectId(id) });
  res.json({ message: 'Diary is fetched!', diary });
})


// get statistics (emotion for these past 7 days)
app.get('/api/statistics', securityMiddleware, async (req, res) => {
  const limit = 7;

  const diaries = await db.collection('diary').find({
    user: new ObjectId(req.user._id)
  }, { sort: { date: -1 }, limit }).toArray();

  const emotions = diaries.map(diary => {
    const emotionArray = [
      "DEPRESSED",
      "SAD",
      "ANGRY",
      "FRUSTRATED",
      "NEUTRAL",
      "HOPEFUL",
      "PEACEFUL",
      "JOYFUL",
      "HAPPY",
      "ECSTATIC",
    ];
    return emotionArray.indexOf(diary.emotion) + 1;
  });

  const dates = diaries.map(diary => diary.date);

  res.json({
    message: 'Statistics fetched!',
    emotions,
    dates
  });
});




// Helper


function generateToken(user) {
  const payload = {
    id: user._id,
    email: user.email,
    firstName: user.firstName,
    middleName: user.middleName,
    lastName: user.lastName
  };

  const secretKey = jwt_secret; // Replace with your actual secret key
  const options = {
    expiresIn: '1h', // Token expiration time
  };

  return jwt.sign(payload, secretKey, options);
}


/**
 * NEW HELPER FUNCTION
 * Cleans a complex Data URI by removing extra parameters like 'codecs=opus'.
 * @param {string} dataUri - The original, potentially complex Data URI from the browser.
 * @returns {string} A simplified Data URI that Cloudinary can understand.
 */
function cleanDataUri(dataUri) {
  // Split the URI into header and data parts
  const parts = dataUri.split(',');
  if (parts.length < 2) {
    // Not a valid Data URI
    return dataUri; 
  }

  const header = parts[0];
  const data = parts[1];
  
  // Use a regex to extract just the core MIME type (e.g., "audio/webm")
  // from a header like "data:audio/webm;codecs=opus"
  const mimeTypeMatch = header.match(/data:([a-zA-Z0-9\/+.-]+)/);

  if (!mimeTypeMatch || mimeTypeMatch.length < 2) {
    // Could not find a valid MIME type
    return dataUri;
  }
  
  const cleanMimeType = mimeTypeMatch[1];
  
  // Reconstruct the Data URI into the simple format
  const cleanUri = `data:${cleanMimeType};base64,${data}`;
  
  return cleanUri;
}


/**
 * (THE NEW, ROBUST VERSION)
 * Uploads a Base64 encoded audio string to Cloudinary using a Buffer and a stream.
 * This method is more reliable and avoids file path errors.
 *
 * @param {string} base64AudioString - The Base64 audio data, formatted as a Data URI.
 * @param {string} fileName - The desired file name (without extension).
 * @param {string} destinationFolder - The folder in Cloudinary to store the asset.
 * @returns {Promise<object>} A promise that resolves with the Cloudinary upload result.
 */
function uploadBase64Audio(base64AudioString, fileName, destinationFolder) {
  console.log(`Uploading '${fileName}' via stream to Cloudinary folder '${destinationFolder}'...`);
  
  // We'll wrap the stream-based upload in a Promise to use it with async/await
  return new Promise((resolve, reject) => {
    
    // Step 1: Get the raw Base64 data from the Data URI
    // The regex is a safe way to handle various URI formats
    const base64Data = base64AudioString.replace(/^data:audio\/\w+;((codecs=[\w-]+);)?base64,/, "");
    
    // Step 2: Convert the Base64 data to a Buffer
    const audioBuffer = Buffer.from(base64Data, 'base64');
    
    // Step 3: Create the upload stream
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "video", // Audio files use the 'video' resource type
        public_id: fileName,
        folder: destinationFolder,
      },
      (error, result) => {
        if (error) {
          // If Cloudinary returns an error, reject the promise
          console.error("❌ Error from Cloudinary during stream upload:", error);
          return reject(error);
        }
        // If successful, resolve the promise with the result
        console.log(`✅ Successfully uploaded. Public ID: ${result.public_id}`);
        resolve(result);
      }
    );
    
    // Step 4: Create a readable stream from our buffer and pipe it to the upload stream
    const bufferStream = new Readable();
    bufferStream._read = () => {}; // No-op _read method
    bufferStream.push(audioBuffer);
    bufferStream.push(null); // Signal the end of the stream
    
    bufferStream.pipe(uploadStream);
  });
}



/**
 * Generates a URL for a Cloudinary asset.
 *
 * @param {string} publicId - The full public_id of the asset (including folder path).
 * @returns {string} The secure, publicly accessible URL for the audio file.
 */
function getAudioUrl(publicId) {
  // Cloudinary's .url() method builds the URL.
  // We specify 'video' as the resource_type again.
  const url = cloudinary.url(publicId, {
    resource_type: "video",
    secure: true, // Ensures the URL uses https
  });

  return url;
}



// For Google Gemini Helper

const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

/**
 * Uploads a file to the Google Generative AI API.
 * @param {string} filePath The path to the file to upload.
 * @param {string} mimeType The MIME type of the file.
 * @returns {Promise<object>} The uploaded file object.
 */
async function uploadFile(filePath, mimeType) {



  try {
    const response = await fetch(filePath);
    const blob = await response.blob();
    console.log(`Uploading blob as file: ${filePath}`);
    const file = await ai.files.upload({
      file: blob,
      config: {
        mime_type: mimeType
      }
    });
    console.log(`Uploaded file on gemini`, file);
    return file;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

/**
 * Analyzes an audio file using the Gemini API and returns a structured JSON object.
 * @param {string} audioFilePath The path to the audio file.
 * @returns {Promise<object>} An object containing psychology_feedback, audio_transcribe, and list_of_goals_generated.
 */
async function analyzeAudio(audioFilePath) {
  const audioMimeType = "audio/webm"; // Change this to the correct MIME type of your audio file

  try {
    // 1. Upload the audio file to the Gemini API
    // const audioFile = await uploadFile(audioFilePath, audioMimeType);

    // while (audioFile.state === "PROCESSING") {
    //   console.log("Waiting for file to become ACTIVE...");
    //   await new Promise(r => setTimeout(r, 5000));
    //   console.log('💖💖💖', audioFile, audioFile.name)
    //   audioFile = await ai.files.get({ name: audioFile.name });
    // }

    // if (audioFile.state !== "ACTIVE") {
    //   throw new Error(`File upload failed with state ${audioFile.state}`);
    // }

    // 2. Define the desired JSON output structure
    const responseSchema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description:
              "Create a title that captures the overall theme or emotional state from the user's audio recording. Use a Gen Z-style Filipino phrase with a touch of formality—something catchy yet sincere that reflects what the user might be going through.",
          },
          psychology_feedback: {
            type: Type.STRING,
            description:
              "Act like a professional psychologist who speaks like a trusted kuya or best friend. Analyze the user's emotional state, tone, and what they said in the audio. Then give thoughtful psychological insights and emotional validation in casual but respectful Tagalog. Use natural Gen Z Filipino expressions (e.g., 'lowkey', 'nakakapagod besh', 'di ko na kaya', etc.), but avoid being too slangy or insensitive. Prioritize comfort, warmth, and understanding. Make your tone feel like a heartfelt convo with someone who truly cares.",
          },
          audio_transcribe: {
            type: Type.STRING,
            description:
              "Transcribe the user's audio recording as accurately as possible. Keep the phrasing natural and true to how they expressed themselves, including emotional cues if any (e.g., sighs, pauses, voice cracking).",
          },
          list_of_goals_generated: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
            description:
              "From the transcription, extract 3 to 5 practical and supportive goals that the user can pursue to improve their mental and emotional health. Goals should be aligned with their current emotional needs and framed in a friendly, doable way—parang payo ng kuya or tropa.",
          },
        },
        propertyOrdering: [
          "psychology_feedback",
          "audio_transcribe",
          "list_of_goals_generated",
        ],
      },
    };

    // 3. Construct the prompt for the Gemini model
    const prompt = `
    You are a male human psychologist who acts like a supportive kuya or best friend. A user has uploaded an audio recording where they express their current thoughts and emotions. Your job is to deeply understand what the user is feeling by listening to how they speak and what they say.

    Then, respond to them in **casual, conversational Tagalog**—not too formal, not too slangy. You can use modern Gen Z expressions naturally (like "di ko na keri", "lowkey", "nakakapagod", etc.), but always keep a tone of empathy, respect, and care.

    Your tone should feel like you're talking to someone close to you: comforting, warm, and non-judgmental. Provide meaningful psychological insights, emotional validation, and suggest helpful next steps or goals to improve their mental well-being.

    Think of this as a deep, safe convo between two people—ikaw yung taong makikinig at mag-aalaga.
    `;
    
    // 4. Select the Gemini model and configure it to return JSON
    const model = ai.chats.create({ model: 'gemini-2.5-pro'})

    // 5. Generate the content
    console.log("Generating content from the model...");
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {text: prompt},
        {
          inlineData: {
            mimeType: audioMimeType,
            data: stripDataUriPrefix(audioFilePath),
          }
        }
      ],
      config: {
        responseSchema: responseSchema,
        responseMimeType: "application/json"
      }
    });
    // const response = result.response;
    const responseText = result.text;

    console.log("Received response from Gemini.", result);

    // 6. Parse and return the JSON response
    return JSON.parse(responseText);
    console.log(responseText);
    return responseText;

  } catch (error) {
    console.error("An error occurred during audio analysis:", error);
    throw error;
  }
}



/**
 * Remove Data URI prefix from a Base64 string.
 * @param {string} dataUri - e.g. "data:audio/webm;base64,GkXfo..."
 * @returns {string} pure Base64 string without prefix
 */
function stripDataUriPrefix(dataUri) {
  return dataUri.replace(/^data:audio\/[a-zA-Z-+]+;base64,/, "");
}




MongoClient.connect(url)
  .then(client => {
    console.log("Connected successfully to server");
    db = client.db(dbName);
    
    app.listen(3001, () => console.log('Example app listening on port 3001!'));
  })
  .catch(err => console.error(err));



