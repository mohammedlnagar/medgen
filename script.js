$(document).ready(function () {
  $("#generatePDF").on("click", function (event) {
    event.preventDefault(); // Prevent the form from submitting
    generatePDF(); // Call the custom function to generate the PDF
  });
  const doctorStamps = {
    "Ms. Aya Shafik": "assets/stamps/aya.png",
    "Ms. Chaanan Kaur": "assets/stamps/chaanan.png",
    "Dr. Bassem Badr": "assets/stamps/DR BASSEM.png",
    "Dr. Edma Naddaf": "assets/stamps/Edma Naddaf.png",
    "Dr. Maryam Al Suwaidi": "assets/stamps/maryam alsuwaidi.png",
    "Dr. Sravani Behara": "assets/stamps/sravani.png",
    "Ms. Ritasha Varsani": "assets/stamps/Ritasha Varsani.png",
    "Dr. Mansour Assaf": "assets/stamps/Mansour Assaf.png",
    "Ms. Safia Malik": "assets/stamps/SAFIA.png",
    "Dr. Khaleel Hinkston": "assets/stamps/KHALEEL.png",
  };

  let diagnosisList = [
    {
      code: "F41.1",
      template: `Chief Complaint:
Primary Concern: Anxiety
Presenting Issue:
The patient reports ongoing generalized anxiety but has shown significant improvement in managing symptoms with new coping strategies. Ongoing treatment and monitoring are necessary for long-term stability.
Mental Status Examination:
•	Appearance & Behavior: Well-dressed, alert, oriented to time, place, person, and purpose.
•	Mood: Describes mood as "good," showing improvement.
•	Affect: Full range, emotionally flexible and appropriately expressive.
Prognosis:
Positive outlook due to improved coping skills and stable emotional state. Anxiety persists but is managed with medication and lifestyle changes. Continued treatment and follow-up are essential for maintaining stability.
Risk Assessment:
•	Suicidal Ideation: Denies suicidal thoughts.
•	Self-Harm: No history of self-harm.
•	Aggression: No history of aggression.
•	Substance Misuse: Denies any substance misuse.
Management Plan:
•	Medication: Continue current regimen, monitor effectiveness.
•	Lifestyle Modifications: Regular exercise, balanced diet, and adequate sleep.
•	Follow-Up: Schedule within 30 days; contact sooner if symptoms worsen.
Patient Education:
•	Educated on medication adherence and potential side effects.
•	Discussed the importance of exercise, diet, stress reduction (mindfulness, deep breathing), and therapy for managing anxiety.
Plan for Next Session:
•	Continue monitoring anxiety levels, adjust coping strategies as needed.
•	Review medication effectiveness and make adjustments if necessary.
`,
    },
    {
      code: "F32.1",
      template:
        "This is a template for the clients with Major Depressive Disorder",
    },
  ];

  $("#patientFullName, #patientDOB, #evaluationDate, #notes").on(
    "input",
    function () {
      updateView();
    }
  );

  $("#doctorName, #pri_diagnosis, #sec_diagnosis, #notes_temp").on(
    "change",
    function () {
      changeTemp();
    }
  );

  // $("#generatePDF").on("click", function () {
  //   generatePDF();
  // });

  function updateView() {
    const patientName = $("#patientFullName").val();
    const dob = $("#patientDOB").val();
    const evaluationDate = $("#evaluationDate").val();
    const notes = $("#notes").val();

    $("#viewName").text(patientName);
    $("#viewdob").text(dob);
    $("#viewEvDate").text(evaluationDate);
    $("#viewNotes").text(notes);
  }

  function changeTemp() {
    const docName = $("#doctorName").val();
    const pri_diagnosis = $("#pri_diagnosis").val();
    const sec_diagnosis = $("#sec_diagnosis").val();
    const noteTemp = $("#notes_temp").val();
    const stampImage = $("#stamp-image");

    for (let diagnosis of diagnosisList) {
      if (diagnosis.code == noteTemp) {
        $("#notes").text(diagnosis.template);
        $("#viewNotes").text(diagnosis.template);
      }
    }

    // Update the stamp image if a valid doctor is selected
    if (doctorStamps[docName]) {
      stampImage.attr("src", doctorStamps[docName]); // Set the image source
      stampImage.show(); // Ensure the image is visible
    } else {
      stampImage.hide(); // Hide the image if no valid doctor is selected
    }

    // $("#viewNotes").text(noteTemp);
    $("#viewDoc").text(docName);
    $("#viewDiag").text(
      `Primary Diagnosis: ${pri_diagnosis} & Secondary Diagnosis: ${sec_diagnosis}`
    );
  }
  async function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add the logo
    const logoUrl = "assets/logo/logo.png"; // Path to your logo file
    const logoBase64 = await fetchImageAsBase64(logoUrl);
    doc.addImage(logoBase64, "PNG", 115, 10, 90, 15); // Adjust position and size as needed

    // Add a title below the logo
    doc.setFontSize(20);
    doc.text("Medical Report", 10, 20);

    // Define content for the PDF
    const patientFullName = $("#patientFullName").val();
    const dob = $("#patientDOB").val();
    const evaluationDate = $("#evaluationDate").val();
    const doctorName = $("#doctorName").val();
    const pri_diagnosis = $("#pri_diagnosis").val();
    const sec_diagnosis = $("#sec_diagnosis").val();
    const notes = $("#notes").val();

    // Add patient information
    doc.setFontSize(12);
    doc.text(`Patient Full Name: ${patientFullName}`, 10, 40);
    doc.text(`DOB: ${dob}`, 10, 45);
    doc.text(`Evaluation Date: ${evaluationDate}`, 10, 50);

    // Add doctor and diagnosis information
    doc.text(`Doctor Name: ${doctorName}`, 10, 60);
    doc.text(
      `Primary Diagnosis: ${pri_diagnosis} & Secondary Diagnosis: ${sec_diagnosis}`,
      10,
      65
    );

    // Add notes
    doc.setFontSize(12);
    doc.text("Notes:", 10, 70);
    doc.setFontSize(10);
    doc.text(notes, 10, 75, { maxWidth: 190 });

    // Include the stamp if available
    const stampSrc = $("#stamp-image").attr("src");
    if (stampSrc) {
      const stampImage = await fetchImageAsBase64(stampSrc);
      doc.addImage(stampImage, "PNG", 115, 270, 63, 25); // Adjust position and size as needed
    }

    // Add a footer (optional)
    doc.setFontSize(10);
    doc.text("Generated by MedGen", 10, 290);

    // Save the PDF
    doc.save(`${patientFullName}.pdf`);
  }

  // Helper function to fetch an image as a Base64 string
  async function fetchImageAsBase64(imageUrl) {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // async function generatePDF() {
  //   const { jsPDF } = window.jspdf;
  //   const doc = new jsPDF();

  //   // Define content for the PDF
  //   const patientFullName = $("#viewName").val();
  //   const dob = $("#viewdob").val();
  //   const evaluationDate = $("#viewEvDate").val();
  //   const doctorName = $("#viewDoc").val();
  //   const diagnosis = $("#viewDiag").val();
  //   const notes = $("#notes").val();
  //   console.log(notes);

  //   // Add a title
  //   doc.setFontSize(20);
  //   doc.text("Medical Report", 10, 20);

  //   // Add patient information
  //   doc.setFontSize(12);
  //   doc.text(`Patient Full Name: ${patientFullName}`, 10, 40);
  //   doc.text(`DOB: ${dob}`, 10, 50);
  //   doc.text(`Evaluation Date: ${evaluationDate}`, 10, 60);

  //   // Add doctor and diagnosis information
  //   doc.text(`Doctor Name: ${doctorName}`, 10, 80);
  //   doc.text(`Diagnosis: ${diagnosis}`, 10, 90);

  //   // Add notes
  //   doc.setFontSize(14);
  //   doc.text("Notes:", 10, 110);
  //   doc.setFontSize(12);
  //   doc.text(notes, 10, 120, { maxWidth: 190 });

  //   // Reserve space for signature and stamp
  //   doc.setLineWidth(0.5);
  //   doc.line(10, 260, 200, 260); // Horizontal line
  //   doc.text("Signature", 30, 270);
  //   doc.text("Stamp", 150, 270);

  //   // Add a footer (optional)
  //   doc.setFontSize(10);
  //   doc.text("Generated by MedGen", 10, 290);

  //   // Save the PDF
  //   doc.save("Medical_Report.pdf");
  // }

  // old function
  // async function generatePDF() {
  //   const { jsPDF } = window.jspdf;

  //   const name = $("#viewName").text();
  //   const email = $("#viewEmail").text();

  //   const doc = new jsPDF();

  //   // Add your letterhead image (logo) in Base64 format
  //   const logoBase64 = `data:image/png;base64,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`;
  //   // Replace with your Base64 encoded image'

  //   // Adding the logo image at the top
  //   doc.addImage(logoBase64, "JPEG", 10, 10, 66, 15); // Position at (10, 10) with width 50 and height 20

  //   // Adding some main content
  //   doc.setFontSize(14);
  //   doc.text("Main Content Starts Here", 10, 60); // Starting the main content below the letterhead
  //   doc.text(`Name: ${name}`, 10, 40);
  //   doc.text(`Email: ${email}`, 10, 50);

  //   // Example of adding more content
  //   doc.text(
  //     "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  //     10,
  //     70
  //   );
  //   doc.text(
  //     "Curabitur nec felis leo. Nam sodales ante at odio consequat, nec viverra nunc.",
  //     10,
  //     80
  //   );
  //   // Add your letterhead image (logo) in Base64 format
  //   const footerImage = `data:image/png;base64,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`;
  //   // Replace with your Base64 encoded image'

  //   // Adding the logo image at the top
  //   doc.addImage(footerImage, "JPEG", 10, 200, 195, 27); // Position at (10, 10) with width 50 and height 20

  //   doc.save("form-data.pdf");
  // }
});
