import React from 'react';

const AboutPage = () => {
  return (
    <section className="min-h-[70vh]  py-16 bg-[#071026] text-white">
      <div className="max-w-4xl mx-auto py-10 px-6">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">About SITYOG Notes</h1>

        <p className="text-gray-300 mb-6 leading-relaxed">
          SITYOG Notes is a lightweight, student-first platform for sharing lecture notes and previous-year question papers within the SITYOG Group of Institutions community. Our goal is to make study resources discoverable, easy to upload, and simple to download.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
            <p className="text-gray-300 text-sm">
              Empower students to collaborate and learn from each other by providing a centralised place for academic materials. We prioritise fast uploads, reliable downloads and an uncluttered, mobile-friendly interface.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">What We Offer</h3>
            <ul className="list-disc pl-5 text-gray-300 text-sm space-y-2">
              <li>Quick uploads with progress feedback</li>
              <li>Organised notes and searchable downloads</li>
              <li>Privacy-first approach — you control your uploads</li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h4 className="font-semibold mb-2">Get Involved</h4>
          <p className="text-gray-300 text-sm mb-4">If you have notes or past questions that helped you study, consider uploading them to help your classmates. Use the Upload page (requires sign-in) to contribute.</p>
          <div className="flex gap-3">
            <a href="/upload" className="inline-block px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white text-sm">Upload Notes</a>
            <a href="/download" className="inline-block px-4 py-2 border border-gray-600 rounded text-gray-200 text-sm hover:border-blue-400">Browse Notes</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
