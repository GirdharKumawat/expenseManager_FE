import { ArrowLeft, Shield, Lock, Eye, Database, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="mx-auto max-w-4xl px-4 py-4">
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => navigate('/')}
                            className="rounded-full bg-emerald-600 p-2 transition-colors hover:bg-emerald-700"
                        >
                            <ArrowLeft className="h-5 w-5 text-white" />
                        </button>
                        <div className="flex items-center space-x-2">
                            <Shield className="h-6 w-6 text-emerald-600" />
                            <h1 className="text-xl font-bold text-gray-900">Privacy Policy</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="mx-auto max-w-4xl px-4 py-8">
                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <div className="mb-6">
                        <p className="text-sm text-gray-600">
                            Last updated: {new Date().toLocaleDateString()}
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Introduction */}
                        <section>
                            <h2 className="mb-3 text-lg font-semibold text-gray-900 flex items-center space-x-2">
                                <Lock className="h-5 w-5 text-emerald-600" />
                                <span>1. Introduction</span>
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                This Privacy Policy describes how Expense Manager collects, uses, and protects your personal information when you use our application. We are committed to protecting your privacy and ensuring the security of your personal data.
                            </p>
                        </section>

                        {/* Information We Collect */}
                        <section>
                            <h2 className="mb-3 text-lg font-semibold text-gray-900 flex items-center space-x-2">
                                <Database className="h-5 w-5 text-emerald-600" />
                                <span>2. Information We Collect</span>
                            </h2>
                            <div className="space-y-3 text-gray-700">
                                <h3 className="font-medium text-gray-800">Personal Information:</h3>
                                <ul className="ml-6 list-disc space-y-1">
                                    <li>Name and email address (for account creation)</li>
                                    <li>Profile information you choose to provide</li>
                                    <li>Authentication data (encrypted passwords)</li>
                                </ul>
                                
                                <h3 className="font-medium text-gray-800 mt-4">Usage Information:</h3>
                                <ul className="ml-6 list-disc space-y-1">
                                    <li>Expense and transaction data you input</li>
                                    <li>Group memberships and interactions</li>
                                    <li>App usage patterns and preferences</li>
                                </ul>
                            </div>
                        </section>

                        {/* How We Use Information */}
                        <section>
                            <h2 className="mb-3 text-lg font-semibold text-gray-900 flex items-center space-x-2">
                                <Eye className="h-5 w-5 text-emerald-600" />
                                <span>3. How We Use Your Information</span>
                            </h2>
                            <div className="space-y-3 text-gray-700">
                                <p>We use your information to:</p>
                                <ul className="ml-6 list-disc space-y-1">
                                    <li>Provide and maintain the expense tracking service</li>
                                    <li>Process transactions and calculate settlements</li>
                                    <li>Enable collaboration within expense groups</li>
                                    <li>Improve our application and user experience</li>
                                    <li>Send important notifications about your account</li>
                                </ul>
                            </div>
                        </section>

                        {/* Data Security */}
                        <section>
                            <h2 className="mb-3 text-lg font-semibold text-gray-900">4. Data Security</h2>
                            <div className="space-y-3 text-gray-700">
                                <p>We implement appropriate security measures to protect your personal information:</p>
                                <ul className="ml-6 list-disc space-y-1">
                                    <li>Encrypted data transmission (HTTPS)</li>
                                    <li>Secure password storage with hashing</li>
                                    <li>Regular security updates and monitoring</li>
                                    <li>Limited access to personal data by authorized personnel only</li>
                                </ul>
                            </div>
                        </section>

                        {/* Data Sharing */}
                        <section>
                            <h2 className="mb-3 text-lg font-semibold text-gray-900">5. Data Sharing</h2>
                            <p className="text-gray-700 leading-relaxed">
                                We do not sell, trade, or rent your personal information to third parties. Your expense data is only shared with other members of groups you voluntarily join. We may share aggregated, non-personal information for analytical purposes.
                            </p>
                        </section>

                        {/* Your Rights */}
                        <section>
                            <h2 className="mb-3 text-lg font-semibold text-gray-900">6. Your Rights</h2>
                            <div className="space-y-3 text-gray-700">
                                <p>You have the right to:</p>
                                <ul className="ml-6 list-disc space-y-1">
                                    <li>Access your personal data</li>
                                    <li>Correct inaccurate information</li>
                                    <li>Delete your account and associated data</li>
                                    <li>Export your data</li>
                                    <li>Opt-out of non-essential communications</li>
                                </ul>
                            </div>
                        </section>

                        {/* Cookies and Tracking */}
                        <section>
                            <h2 className="mb-3 text-lg font-semibold text-gray-900">7. Cookies and Tracking</h2>
                            <p className="text-gray-700 leading-relaxed">
                                We use cookies and similar technologies to enhance your experience, remember your preferences, and analyze usage patterns. You can control cookie settings through your browser preferences.
                            </p>
                        </section>

                        {/* Changes to Policy */}
                        <section>
                            <h2 className="mb-3 text-lg font-semibold text-gray-900">8. Changes to This Policy</h2>
                            <p className="text-gray-700 leading-relaxed">
                                We may update this Privacy Policy from time to time. We will notify users of any material changes and update the "Last updated" date at the top of this policy.
                            </p>
                        </section>

                        {/* Contact Information */}
                        <section>
                            <h2 className="mb-3 text-lg font-semibold text-gray-900">9. Contact Us</h2>
                            <p className="text-gray-700 leading-relaxed">
                                If you have any questions about this Privacy Policy or how we handle your personal information, please contact us through the application's support channels.
                            </p>
                        </section>
                    </div>

                    {/* Project Disclaimer */}
                    <div className="mt-8 rounded-lg border border-orange-200 bg-orange-50 p-4">
                        <div className="flex items-start space-x-3">
                            <AlertTriangle className="h-6 w-6 text-orange-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-orange-800 mb-2">Project Disclaimer</h3>
                                <p className="text-sm text-orange-700 leading-relaxed">
                                    <strong>Important Notice:</strong> This is a project application developed for educational and demonstration purposes. 
                                    While we implement security measures, there may be technical vulnerabilities or mistakes in data handling. 
                                    The developers are not responsible for any data breaches, privacy violations, or other security issues that may occur. 
                                    Please use this application at your own discretion and avoid storing highly sensitive financial information.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
