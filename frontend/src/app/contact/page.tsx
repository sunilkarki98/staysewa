import type { Metadata } from "next";
import Footer from "../../components/layout/Footer";

export const metadata: Metadata = {
    title: "Contact Us | StaySewa",
    description:
        "Get in touch with StaySewa. We're here to help you find the perfect accommodation in Kathmandu, Nepal.",
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <main className="mx-auto max-w-4xl px-6 py-16">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                    Contact Us
                </h1>

                <p className="text-gray-600 dark:text-gray-300 text-lg mb-10">
                    Have questions or need assistance? We&apos;d love to hear from you.
                </p>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                Email
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                support@staysewa.com
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                Phone
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                +977 9801234567
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                Address
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Thamel, Kathmandu<br />
                                Nepal
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                Business Hours
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Sunday - Friday: 9:00 AM - 6:00 PM<br />
                                Saturday: Closed
                            </p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Send us a message
                        </h2>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Your name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Message
                                </label>
                                <textarea
                                    rows={4}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="How can we help you?"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 transition"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
