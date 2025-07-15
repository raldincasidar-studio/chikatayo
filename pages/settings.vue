<template>
    <div>
        
        <h2 class="mb-5"><v-icon class="mr-1" size="30" color="primary">mdi-cog</v-icon> Settings</h2>

        <v-tabs v-model="tab" align-tabs="center">
            <v-tab value="userInfo">Change User Info</v-tab>
            <v-tab value="dataDeletion">Request Data Deletion</v-tab>
            <v-tab value="privacy-policy">Privacy & Policy</v-tab>
        </v-tabs>

        <v-window v-model="tab">
            <v-window-item value="userInfo">
                <v-form @submit.prevent="updateUser">
                    <v-row class="mt-4">
                        <v-col cols="12" md="6">
                            <v-text-field v-model="user.firstName" label="First Name" outlined></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="user.middleName" label="Middle Name" outlined></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="user.lastName" label="Last Name" outlined></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="user.email" label="Email" outlined></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="user.contact" label="Contact" outlined></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="newPassword" label="New Password" type="password" outlined></v-text-field>
                        </v-col>
                        <v-col cols="12" class="text-center">
                            <v-btn color="primary" type="submit" :loading="loading">Update</v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-window-item>

            <v-window-item value="dataDeletion">
                <v-row class="mt-4">
                    <v-col cols="12" class="text-center">
                        <h3 class="mb-3">Request Data Deletion</h3>
                        <p style="font-size: 1.2rem;">alam naming mahalaga ang lahat ng data mo. Anytime ay pwede mong idelete ito sa aming server. Pindutin lamang ang button at ipadala ang email sa <a href="mailto:raldin.disomimba13@gmail.com">raldin.disomimba13@gmail.com</a> para irequest ang pagdelete ng iyong data dito sa application na ito.</p>
                    </v-col>
                    <v-col cols="12" class="text-center mt-10">
                        <v-btn to="mailto:raldin.disomimba13@gmail.com" color="primary" type="submit" prepend-icon="mdi-inbox">Send us Email</v-btn>
                    </v-col>
                </v-row>
            </v-window-item>

            
            <v-window-item value="privacy-policy">
                <v-row class="mt-4">
                    <v-col cols="12" class="text-left privacy-paper">
                        <h3 class="mb-3">Privacy and Policy for Chika Tayo</h3>
                        <p><strong>Last Updated:</strong> July 15, 2025</p>

                        <p>This Privacy Policy describes how [Your Company Name] ("we," "us," or "our") collects, uses, processes, and shares your information when you use our mobile web-application, [Your App Name] (the "Service"). We are committed to protecting your privacy and handling your personal information with care and transparency, in compliance with the **Philippine Data Privacy Act of 2012 (Republic Act No. 10173)** and other relevant regulations.</p>

                        <p>By accessing or using our Service, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with the terms of this policy, please do not use our Service.</p>

                        <h4>1. Information We Collect</h4>
                        <p>We collect various types of information from and about you to provide and improve our Service.</p>

                        <h5>A. Personal Information You Directly Provide:</h5>
                        <p>When you register for an account or interact with our Service, you may provide us with the following personal information:</p>
                        <ul>
                            <li><strong>Full Name:</strong> For account identification and personalization.</li>
                            <li><strong>Email Address:</strong> For account management, communication, and notifications.</li>
                            <li><strong>Contact Number:</strong> For account management and essential communications.</li>
                            <li><strong>Rants (User-Generated Content):</strong> Any text-based content you voluntarily submit through the Service, which may contain personal insights or opinions.</li>
                            <li><strong>Voice Data:</strong> Audio recordings you voluntarily submit through the Service.</li>
                        </ul>

                        <h5>B. Information Collected Automatically (Cookies):</h5>
                        <p>When you access and use our Service, we automatically collect certain information using "cookies" and similar tracking technologies. These are small data files placed on your device.</p>
                        <ul>
                            <li><strong>Authentication Cookies:</strong> We use cookies to verify your identity when you log in, keeping you signed in to your account.</li>
                            <li><strong>Identity Tracking Cookies:</strong> These cookies help us recognize you as a returning user and personalize your experience. They do not track your activity across other websites.</li>
                        </ul>

                        <h4>2. How We Use Your Information</h4>
                        <p>We use the information we collect for the following purposes:</p>
                        <ul>
                            <li><strong>To Provide and Maintain Our Service:</strong> This includes enabling you to create and manage your account, access features, and use the core functionalities of the app.</li>
                            <li><strong>Account Management:</strong> To manage your user account, provide customer support, and communicate with you regarding your account.</li>
                            <li><strong>Service Improvement:</strong> To understand how users interact with our Service, identify areas for improvement, and develop new features.</li>
                            <li><strong>Analyzation of Voice Data:</strong> To process and analyze the voice data you submit. This analysis helps us to understand patterns, sentiments, or other relevant insights from the "rants" you share, which can contribute to the overall functionality and improvement of the Service.</li>
                        </ul>

                        <h4>3. Sharing Your Information</h4>
                        <p>We understand the sensitivity of your personal information and share it only in limited circumstances as described below:</p>
                        <ul>
                            <li><strong>Third-Party Service Providers (Google Gemini):</strong> We share your <strong>voice data</strong> with <strong>Google Gemini</strong> for the sole purpose of <strong>analyzation</strong>. Google Gemini processes this data to provide us with insights as part of its language model services. Please be aware that Google's use and retention of your data are governed by their own privacy policies and terms of service. As of the current date, Google's policy for Gemini API indicates data retention for abuse monitoring purposes for fifty-five (55) days, and data caching for up to 24 hours (which can be disabled by us). We have taken steps to configure our integration with Google Gemini to limit data retention as much as feasible.</li>
                            <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in the good faith belief that such action is necessary to comply with a legal obligation, protect and defend our rights or property, prevent or investigate possible wrongdoing in connection with the Service, protect the personal safety of users of the Service or the public, or protect against legal liability.</li>
                            <li><strong>Business Transfers:</strong> In the event that we are involved in a merger, acquisition, reorganization, bankruptcy, or sale of all or a portion of our assets, your information may be transferred as part of that transaction. We will notify you of any such change in ownership or control of your personal information.</li>
                        </ul>

                        <h4>4. Data Retention</h4>
                        <p>We retain your personal information for as long as necessary to fulfill the purposes for which it was collected, including for the purposes of satisfying any legal, accounting, or reporting requirements.</p>
                        <ul>
                            <li><strong>Account Information:</strong> Your full name, email, and contact number are retained for the duration of your active account. If you request account deletion, we will initiate the deletion process as described below, subject to legal obligations.</li>
                            <li><strong>Rants:</strong> Your submitted rants are retained as long as they are relevant to the purpose of the Service and for analytical purposes.</li>
                            <li><strong>Voice Data:</strong> Voice data sent to Google Gemini is retained by Google according to their policies (currently up to 55 days for abuse monitoring, and potentially 24 hours for caching, which we aim to minimize). We do not store raw voice recordings on our servers after they have been processed and sent to Google Gemini, unless explicitly required for a specific, transparent purpose communicated to you.</li>
                            <li><strong>Cookie Data:</strong> Authentication and identity tracking cookies are retained based on their purpose and your browser settings.</li>
                        </ul>

                        <h4>5. Your Data Protection Rights (Philippine Data Privacy Act of 2012)</h4>
                        <p>Under the Data Privacy Act of 2012, you have the following rights regarding your personal information:</p>
                        <ul>
                            <li><strong>Right to be Informed:</strong> You have the right to be informed whether personal information pertaining to you shall be, are being, or have been processed.</li>
                            <li><strong>Right to Object:</strong> You have the right to object to the processing of your personal information, including processing for direct marketing, automated processing, or profiling.</li>
                            <li><strong>Right to Access:</strong> You have the right to reasonable access to your personal information held by us, including information about the purposes of processing, categories of data, and recipients.</li>
                            <li><strong>Right to Rectification:</strong> You have the right to dispute the inaccuracy or error in your personal information and have us correct it immediately and accordingly.</li>
                            <li><strong>Right to Erasure or Blocking (Right to be Forgotten):</strong> You have the right to demand the suspension, withdrawal, removal, or destruction of your personal information from our filing system upon discovery and substantial proof that the personal information is incomplete, outdated, false, unlawfully obtained, used for unauthorized purposes, or no longer necessary for the purposes for which they were collected.</li>
                            <li><strong>Right to Damages:</strong> You have the right to be indemnified for any damages sustained due to inaccurate, incomplete, outdated, false, unlawfully obtained, or unauthorized use of personal information.</li>
                            <li><strong>Right to Data Portability:</strong> You have the right to obtain a copy of your personal data in an electronic or structured format, commonly used and machine-readable.</li>
                            <li><strong>Right to Lodge a Complaint:</strong> You have the right to lodge a complaint with the National Privacy Commission (NPC) if you believe your data privacy rights have been violated.</li>
                        </ul>
                        <p><strong>To exercise any of these rights, please contact us using the contact details provided in Section 10.</strong> We will respond to your request within the timeframes required by law.</p>

                        <h4>6. Account Deletion</h4>
                        <p>You can request the deletion of your account and associated personal data by contacting us directly. Upon receiving a valid request for account deletion, we will:</p>
                        <ul>
                            <li>Deactivate your account.</li>
                            <li>Remove your identifiable personal information from our active databases.</li>
                            <li>Retain anonymized data or data required for legal or legitimate business purposes as permitted by law (e.g., for audit, compliance, or to resolve disputes).</li>
                            <li>Inform you once the deletion process is complete.</li>
                        </ul>

                        <h4>7. Children's Privacy</h4>
                        <p>Our Service is intended for users who are <strong>13 years of age or older</strong>. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and you believe that your child under the age of 13 has provided us with personal information, please contact us, and we will take steps to delete such information from our systems.</p>

                        <h4>8. Security of Your Information</h4>
                        <p>We implement appropriate organizational, physical, and technical security measures to protect your personal information against accidental or unlawful destruction, alteration, unauthorized disclosure, unauthorized access, misuse, and any other unlawful form of processing. However, no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.</p>

                        <h4>9. Changes to This Privacy Policy</h4>
                        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page. Your continued use of the Service after the posting of a revised Privacy Policy constitutes your acceptance of the changes.</p>

                        <h4>10. Contact Us</h4>
                        <p>If you have any questions or concerns about this Privacy Policy, our data practices, or if you wish to exercise your data privacy rights, please contact us:</p>
                        <p><strong>Raldin Casidar Studio</strong><br>
                        Philippines<br>
                        <strong>Email:</strong> raldin.disomimba13@gmail.com<br></p>
                    </v-col>
                    <v-col cols="12" class="text-center mt-10">
                        <v-btn to="mailto:raldin.disomimba13@gmail.com" color="primary" type="submit" prepend-icon="mdi-inbox">Send us Email</v-btn>
                    </v-col>
                </v-row>
            </v-window-item>


        </v-window>
    </div>
</template>

<style>
.privacy-paper p {
    margin: 15px 0;
}

.privacy-paper ul {
    margin: 15px 0;
    padding-left: 20px;
}

.privacy-paper li {
    margin: 5px 0;
}

.privacy-paper h4 {
    margin: 20px 0 10px;
}

.privacy-paper strong {
    font-weight: bold;
}
</style>

<script setup>
import { ref, onMounted } from 'vue';
import useMyFetch from '~/composables/useMyFetch';

definePageMeta({
    layout: "dash"
});

const tab = ref('userInfo');
const user = ref({});
const deletionEmail = ref('');

const { myFetch, error, loading } = useMyFetch();

async function fetchUserInformation() {
    const res = await myFetch("/user");
    if (res && !error.value) {
        user.value = res.user;
    } else if (error.value) {
        alert(`Error fetching user: ${error.value}`);
    }
}

async function updateUser() {
    const res = await myFetch("/user", {
        method: 'PUT',
        body: JSON.stringify(user.value)
    });

    if (res && !error.value) {
        alert('User information updated successfully!');
    } else if (error.value) {
        alert(`Error updating user: ${error.value}`);
    }
}

onMounted(() => {
    fetchUserInformation();
});
</script>