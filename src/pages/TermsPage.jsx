import React from 'react'

export default function TermsPage(){
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-900 px-6 py-10">
      <div className="max-w-3xl mx-auto bg-white dark:bg-neutral-800 rounded-2xl shadow p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Terms and Conditions</h1>
        <p className="mt-4 text-gray-700 dark:text-gray-200">
          This is a placeholder Terms and Conditions document. Replace this content with your actual
          legal terms. By using this application, you agree to abide by the stated policies and guidelines.
        </p>
        <ul className="mt-6 list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-200">
          <li>Use the platform responsibly and legally.</li>
          <li>Respect privacy and data protection rules.</li>
          <li>Do not attempt to misuse or attack the service.</li>
        </ul>
      </div>
    </div>
  )
}


