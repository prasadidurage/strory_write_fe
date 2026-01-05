

export function RulesAndPolicies() {
    const rules = [
        {
            title: "1. Respect & Kindness",
            description: "Treat all members with respect. Harassment, hate speech, or abusive language will not be tolerated."
        },
        {
            title: "2. Original Content Only",
            description: "Share only your own work. Plagiarism is strictly prohibited and may lead to account suspension."
        },
        {
            title: "3. Age-Appropriate Material",
            description: "Avoid publishing explicit or inappropriate content that violates community guidelines or local laws."
        },
        {
            title: "4. Constructive Feedback",
            description: "If offering feedback, keep it constructive and respectful. This is a space for encouragement and growth."
        },
        {
            title: "5. Copyright & Usage Rights",
            description: "Writers retain full rights to their work. By publishing, you grant us non-exclusive rights to display it on the platform."
        },
        {
            title: "6. No Spam or Self-Promo",
            description: "Avoid spamming, excessive self-promotion, or linking to unrelated third-party sites."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-20 px-6">
            <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-10">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                        📜 Platform Rules & Policies
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900">
                        Guidelines to Keep Our Community Safe & Creative
                    </h1>
                    <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
                        These policies are in place to help foster a safe, respectful, and productive environment for all storytellers.
                    </p>
                </div>

                <div className="space-y-8">
                    {rules.map((rule, index) => (
                        <div key={index} className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-100 shadow-md hover:shadow-lg transition">
                            <h2 className="text-xl font-semibold text-purple-700 mb-2">{rule.title}</h2>
                            <p className="text-gray-700 text-base">{rule.description}</p>
                        </div>
                    ))}
                </div>


            </div>
        </div>
    );
}
