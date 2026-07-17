import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBMKN983mAjjtHo_UMaNEZdE6rryh6msbw",
  authDomain: "my-portfolio-34630.firebaseapp.com",
  projectId: "my-portfolio-34630",
  storageBucket: "my-portfolio-34630.firebasestorage.app",
  messagingSenderId: "723804171290",
  appId: "1:723804171290:web:21bc10d3fd3ffb0b31f5a3",
  measurementId: "G-SX1NG8G1NL"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const certifications = [
  {
    title: "CCNA",
    fullName: "Cisco Certified Network Associate",
    issuer: "Cisco",
    description: "The CCNA certification validates your skills and knowledge in network fundamentals, network access, IP connectivity, IP services, security fundamentals, and automation and programmability.\n\n### Key Areas Covered:\n- Routing and Switching\n- Network Security Basics\n- IP Addressing (IPv4/IPv6)\n- Network Automation\n\nI obtained this certification after completing rigorous coursework and passing the 200-301 CCNA exam.",
    badgeUrl: "https://i.imgur.com/39hNqfD.png",
    verifyUrl: "https://www.credly.com",
    issuedDate: "June 2024",
    expiryDate: "June 2027",
    tags: ["Networking", "Security", "Cisco"]
  },
  {
    title: "AWS Cloud Practitioner",
    fullName: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    description: "This certification validates overall understanding of the AWS Cloud platform, covering basic cloud concepts and security.\n\n### Key Areas Covered:\n- AWS Cloud concepts and basic global infrastructure\n- AWS Security and Compliance concepts\n- Core AWS services (EC2, S3, RDS)\n- Pricing, billing, and support models",
    badgeUrl: "https://i.imgur.com/kP7T3c4.png",
    verifyUrl: "https://www.credly.com",
    issuedDate: "August 2024",
    expiryDate: "August 2027",
    tags: ["Cloud", "AWS"]
  },
  {
    title: "CEH",
    fullName: "Certified Ethical Hacker (CEH v12)",
    issuer: "EC-Council",
    description: "The Certified Ethical Hacker (CEH) credential certifies individuals in the specific network security discipline of Ethical Hacking from a vendor-neutral perspective.\n\n### Key Areas Covered:\n- Footprinting and Reconnaissance\n- Scanning Networks\n- Enumeration\n- Vulnerability Analysis\n- System Hacking\n- Malware Threats\n- Sniffing",
    badgeUrl: "https://i.imgur.com/xO43Jp9.png",
    verifyUrl: "https://www.credly.com",
    issuedDate: "October 2024",
    expiryDate: "October 2027",
    tags: ["Security", "Penetration Testing"]
  }
];

async function seed() {
  console.log("Seeding certifications...");
  const certsRef = collection(db, "certifications");
  
  for (const cert of certifications) {
    try {
      const docRef = await addDoc(certsRef, {
        ...cert,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`Added ${cert.title} with ID: ${docRef.id}`);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  console.log("Seeding complete! You can exit (Ctrl+C).");
  process.exit(0);
}

seed();
