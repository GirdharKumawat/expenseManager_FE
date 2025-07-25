import { ArrowLeft, Shield, FileText, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TermsAndConditions = () => {
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
                            <FileText className="h-6 w-6 text-emerald-600" />
                            <h1 className="text-xl font-bold text-gray-900">Terms and Conditions</h1>
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
                            <h2 className="mb-3 text-lg font-semibold text-gray-900">1. Introduction</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Welcome to Expense Manager. By using this application, you agree to comply with and be bound by the following terms and conditions of use. Please review these terms carefully before using our service.
                            </p>
                        </section>

                        {/* Use of Service */}
                        <section>
                            <h2 className="mb-3 text-lg font-semibold text-gray-900">2. Use of Service</h2>
                            <div className="space-y-3 text-gray-700">
                                <p>You may use this application for:</p>
                                <ul className="ml-6 list-disc space-y-1">
                                    <li>Managing personal and group expenses</li>
                                    <li>Tracking financial transactions within groups</li>
                                    <li>Calculating settlements between group members</li>
                                    <li>Analyzing spending patterns</li>
                                </ul>
                            </div>
                        </section>

                        {/* User Responsibilities */}
                        <section>
                            <h2 className="mb-3 text-lg font-semibold text-gray-900">3. User Responsibilities</h2>
                            <div className="space-y-3 text-gray-700">
                                <p>As a user, you agree to:</p>
                                <ul className="ml-6 list-disc space-y-1">
                                    <li>Provide accurate information when creating accounts and expenses</li>
                                    <li>Not use the service for any illegal or unauthorized purposes</li>
                                    <li>Respect other users' privacy and data</li>
                                    <li>Not attempt to hack, disrupt, or damage the service</li>
                                </ul>
                            </div>
                        </section>

                        {/* Data and Privacy */}
                        <section>
                            <h2 className="mb-3 text-lg font-semibold text-gray-900">4. Data and Privacy</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Your privacy is important to us. Please refer to our Privacy Policy for detailed information about how we collect, use, and protect your personal information.
                            </p>
                        </section>

                        {/* Limitation of Liability */}
                        <section>
                            <h2 className="mb-3 text-lg font-semibold text-gray-900">5. Limitation of Liability</h2>
                            <p className="text-gray-700 leading-relaxed">
                                The service is provided "as is" without warranties of any kind. We do not guarantee the accuracy, completeness, or reliability of any information or calculations provided by the application.
                            </p>
                        </section>

                        {/* Modifications */}
                        <section>
                            <h2 className="mb-3 text-lg font-semibold text-gray-900">6. Modifications</h2>
                            <p className="text-gray-700 leading-relaxed">
                                We reserve the right to modify these terms at any time. Users will be notified of significant changes, and continued use of the service constitutes acceptance of the modified terms.
                            </p>
                        </section>

                        {/* Contact Information */}
                        <section>
                            <h2 className="mb-3 text-lg font-semibold text-gray-900">7. Contact Information</h2>
                            <p className="text-gray-700 leading-relaxed">
                                If you have any questions about these Terms and Conditions, please contact us through the application's support channels.
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
                                    While we strive for accuracy, there may be technical errors, bugs, or mistakes in the calculations and functionality. 
                                    The developers are not responsible for any financial losses, data loss, or other damages that may occur from using this application. 
                                    Please use this application at your own discretion and verify all financial calculations independently.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;
