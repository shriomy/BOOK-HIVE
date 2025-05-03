import { useState } from "react";
import { Clock, Send, MessageSquare, Star, ThumbsUp, HelpCircle, AlertCircle } from "lucide-react";

export default function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [feedbackType, setFeedbackType] = useState("general");
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic would go here
    setFormSubmitted(true);
    
    // Reset form after submission (simulated)
    setTimeout(() => {
      setFormSubmitted(false);
      setRating(0);
      setFeedbackType("general");
      e.target.reset();
    }, 3000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      
      {/* Hero Section */}
      <section className="bg-gray-800 text-white py-16">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Share Your Feedback</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Your insights help us improve our services and provide a better experience for all BookWise users.
          </p>
        </div>
      </section>

      {/* Feedback Form Section */}
      <section className="container mx-auto my-12 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          {formSubmitted ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                <ThumbsUp size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-2">Thank You For Your Feedback!</h2>
              <p className="text-gray-600 mb-4">
                We appreciate you taking the time to help us improve our services. Your feedback has been submitted successfully.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-amber-500 px-6 py-4 text-white">
                <h2 className="text-xl font-bold">Feedback Form</h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                </div>

                {/* Feedback Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Feedback Type
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div
                      className={`border rounded-md p-4 cursor-pointer flex items-center gap-3 ${
                        feedbackType === "general" ? "border-amber-500 bg-amber-50" : "border-gray-200 hover:bg-gray-50"
                      }`}
                      onClick={() => setFeedbackType("general")}
                    >
                      <MessageSquare className="text-amber-600" size={20} />
                      <span>General Feedback</span>
                    </div>
                    <div
                      className={`border rounded-md p-4 cursor-pointer flex items-center gap-3 ${
                        feedbackType === "suggestion" ? "border-amber-500 bg-amber-50" : "border-gray-200 hover:bg-gray-50"
                      }`}
                      onClick={() => setFeedbackType("suggestion")}
                    >
                      <HelpCircle className="text-amber-600" size={20} />
                      <span>Suggestion</span>
                    </div>
                    <div
                      className={`border rounded-md p-4 cursor-pointer flex items-center gap-3 ${
                        feedbackType === "issue" ? "border-amber-500 bg-amber-50" : "border-gray-200 hover:bg-gray-50"
                      }`}
                      onClick={() => setFeedbackType("issue")}
                    >
                      <AlertCircle className="text-amber-600" size={20} />
                      <span>Report Issue</span>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How would you rate your experience with BookWise?
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={24}
                        className={`cursor-pointer ${
                          star <= rating ? "fill-amber-500 text-amber-500" : "text-gray-300"
                        }`}
                        onClick={() => setRating(star)}
                      />
                    ))}
                  </div>
                </div>

                {/* Service Used */}
                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                    Which service are you providing feedback on?
                  </label>
                  <select
                    id="service"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  >
                    <option value="">Select a service</option>
                    <option value="resource-banks">Resource Banks</option>
                    <option value="lecture-help">Lecture Help</option>
                    <option value="study-mentors">Study Mentors</option>
                    <option value="wifi-access">Wi-Fi Access</option>
                    <option value="educational-hubs">Educational Hubs</option>
                    <option value="website-platform">Website & Platform</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Feedback Details */}
                <div>
                  <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Feedback
                  </label>
                  <textarea
                    id="feedback"
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Please share your thoughts, experiences, suggestions, or issues you'd like us to address..."
                    required
                  ></textarea>
                </div>

                {/* File Upload */}
                <div>
                  <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Screenshots or Documents (optional)
                  </label>
                  <input
                    type="file"
                    id="file"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Max file size: 5MB. Supported formats: JPG, PNG, PDF
                  </p>
                </div>

                {/* Contact Permission */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="contact-permission"
                    className="mt-1 h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                  />
                  <label htmlFor="contact-permission" className="ml-2 block text-sm text-gray-700">
                    I consent to being contacted by BookWise regarding my feedback if necessary
                  </label>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-md flex items-center gap-2"
                  >
                    <Send size={18} />
                    <span>Submit Feedback</span>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold mb-2">How is my feedback used?</h3>
              <p className="text-gray-600">
                Your feedback is reviewed by our product and service teams to identify areas for improvement. We use this information to prioritize updates, add new features, and enhance our educational offerings.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold mb-2">Will I receive a response to my feedback?</h3>
              <p className="text-gray-600">
                If you've checked the contact permission box and your feedback requires follow-up, a member of our team will reach out to you within 2-3 business days. Otherwise, we'll use your feedback to inform our improvement process.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold mb-2">Can I submit feedback anonymously?</h3>
              <p className="text-gray-600">
                Yes, the name and email fields are optional if you prefer to remain anonymous. However, we won't be able to follow up with you regarding your feedback if you don't provide contact information.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold mb-2">How often should I provide feedback?</h3>
              <p className="text-gray-600">
                We welcome your feedback anytime you have a suggestion, encounter an issue, or want to share your experience. Your ongoing input helps us continuously improve our services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-amber-500 text-white py-16">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Have Questions?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            If you have specific questions or need immediate assistance, our support team is ready to help.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button className="bg-white text-amber-600 px-6 py-3 rounded-md font-bold hover:bg-gray-100">
              Contact Support
            </button>
            <button className="bg-gray-800 text-white px-6 py-3 rounded-md font-bold hover:bg-gray-900">
              View Help Center
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}