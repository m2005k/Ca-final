import mongoose from "mongoose";
import dotenv from "dotenv";
import { Framework } from "./api/models/framework.schema.js";
import { Auth } from "./api/models/auth.schema.js";
import { chunkFramework } from "./utils/chunking.js";
import { generateEmbedding } from "./utils/embeddings.js";
import qdrantClient from "./config/qdrant.js";
import { randomUUID } from "crypto";

dotenv.config();

const frameworksData = [
  {
    name: "Information Security Management System",
    shortCode: "ISO27001-2026",
    description: "International standard for managing information security risks through a systematic approach.",
    version: "2026.1",
    authority: "International Organization for Standardization",
    country: "Global",
    appliesTo: ["company"],
    industry: "Technology/Legal",
    controls: [
      {
        controlId: "A.5.1",
        title: "Information Security Policies",
        description: "Management direction for information security.",
        requirementText: "A set of policies for information security shall be defined and approved by management.",
        mandatory: true,
        riskLevel: "high",
        tags: ["governance", "policy"]
      },
      {
        controlId: "A.9.2",
        title: "User Access Provisioning",
        description: "Ensuring authorized user access.",
        requirementText: "A formal user registration and de-registration process shall be implemented.",
        mandatory: true,
        riskLevel: "medium",
        tags: ["access-control", "identity"]
      }
    ],
    isActive: true,
    uuid: "5c0b438d-4ef8-47d5-9939-ca042e8db259"
  },
  {
    name: "Healthcare Patient Data Protection Act",
    shortCode: "HPDPA-MED",
    description: "Regulatory framework for protecting sensitive patient health information from disclosure.",
    version: "4.2",
    authority: "Department of Health",
    country: "USA",
    appliesTo: ["company", "product"],
    industry: "Healthcare",
    controls: [
      {
        controlId: "SEC-01",
        title: "Data Encryption at Rest",
        description: "Protecting PHI stored on physical media.",
        requirementText: "All patient health identifiers must be encrypted using AES-256 or higher.",
        mandatory: true,
        riskLevel: "high",
        tags: ["encryption", "privacy"]
      },
      {
        controlId: "AUD-05",
        title: "Audit Logging",
        description: "Tracking access to medical records.",
        requirementText: "System must maintain logs of all users who access or modify patient records.",
        mandatory: false,
        riskLevel: "medium",
        tags: ["audit", "compliance"]
      }
    ],
    isActive: true,
    uuid: "0c25e11c-cbf3-49c1-9617-a5d200185dcf"
  },
  {
    name: "Digital Banking Integrity Standard",
    shortCode: "DBIS-FIN",
    description: "Standards for digital banking platforms to prevent fraud and ensure transaction integrity.",
    version: "2.0",
    authority: "Financial Conduct Authority",
    country: "UK",
    appliesTo: ["product"],
    industry: "Finance",
    controls: [
      {
        controlId: "KYC-101",
        title: "Identity Verification",
        description: "Verifying the identity of the customer.",
        requirementText: "The system must verify government-issued IDs using biometric matching.",
        mandatory: true,
        riskLevel: "high",
        tags: ["fraud", "kyc"]
      },
      {
        controlId: "TXN-202",
        title: "Transaction Limits",
        description: "Setting maximum limits for unverified accounts.",
        requirementText: "New accounts shall be limited to $500 transfers per day until 30-day seasoning is complete.",
        mandatory: true,
        riskLevel: "low",
        tags: ["banking", "limits"]
      }
    ],
    isActive: true,
    uuid: "c918239c-43ae-4887-a588-3172488f1d7f"
  },
  {
    name: "FDA 21 CFR Part 820",
    shortCode: "FDA-820",
    description: "Quality System Regulation (QSR) for medical device manufacturers. Ensures that finished devices will be safe and effective and otherwise in compliance with the Federal Food, Drug, and Cosmetic Act.",
    version: "2024.1",
    authority: "Food and Drug Administration (FDA)",
    country: "USA",
    appliesTo: ["company", "product"],
    industry: "Medical Devices",
    controls: [
      {
        controlId: "820.20",
        title: "Management Responsibility",
        description: "Requirements for management with executive responsibility to establish quality policy and organizational structure.",
        requirementText: "Management must establish a quality policy, ensure it is understood, and provide adequate resources for quality system activities.",
        mandatory: true,
        riskLevel: "high",
        tags: ["Governance", "Management"]
      },
      {
        controlId: "820.30",
        title: "Design Controls",
        description: "Controls to ensure that specified design requirements are met.",
        requirementText: "Establish and maintain procedures to control the design of the device in order to ensure that specified design requirements are met.",
        mandatory: true,
        riskLevel: "high",
        tags: ["Design", "R&D"]
      },
      {
        controlId: "820.70",
        title: "Production and Process Controls",
        description: "Requirements for production processes to ensure devices conform to specifications.",
        requirementText: "Establish and maintain process control procedures that describe any process controls necessary to ensure conformance to specifications.",
        mandatory: true,
        riskLevel: "medium",
        tags: ["Manufacturing", "Production"]
      }
    ],
    isActive: true,
    uuid: "a7b4c67f-1b1a-48cf-8d88-29f97b83fcf2"
  },
  {
    name: "FDA 21 CFR Part 211",
    shortCode: "FDA-211",
    description: "Current Good Manufacturing Practice (cGMP) for finished pharmaceuticals.",
    version: "2024.1",
    authority: "Food and Drug Administration (FDA)",
    country: "USA",
    appliesTo: ["product"],
    industry: "Pharmaceuticals",
    controls: [
      {
        controlId: "211.22",
        title: "Responsibilities of Quality Control Unit",
        description: "Establishment of a quality control unit with authority to approve or reject components and drug products.",
        requirementText: "There shall be a quality control unit that shall have the responsibility and authority to approve or reject all components, drug product containers, closures, and labeling.",
        mandatory: true,
        riskLevel: "high",
        tags: ["Quality Control", "Pharma"]
      },
      {
        controlId: "211.160",
        title: "General Laboratory Requirements",
        description: "Establishment of scientifically sound laboratory controls.",
        requirementText: "Establishment of any specifications, standards, sampling plans, or test procedures shall be drafted by the appropriate organizational unit and approved by quality control.",
        mandatory: true,
        riskLevel: "medium",
        tags: ["Laboratory", "Testing"]
      }
    ],
    isActive: true,
    uuid: "8a30eeac-7782-4d2f-acd4-4f22f202dff2"
  },
  {
    name: "ISO 13485:2016",
    shortCode: "ISO-13485",
    description: "International standard for Medical devices — Quality management systems — Requirements for regulatory purposes.",
    version: "2016",
    authority: "International Organization for Standardization",
    country: "International",
    appliesTo: ["company"],
    industry: "Medical Devices / Pharma",
    controls: [
      {
        controlId: "ISO-4.1",
        title: "General QMS Requirements",
        description: "Establishment of a documented quality management system.",
        requirementText: "The organization shall document a quality management system and maintain its effectiveness in accordance with the requirements of this International Standard.",
        mandatory: true,
        riskLevel: "high",
        tags: ["QMS", "Documentation"]
      },
      {
        controlId: "ISO-7.2",
        title: "Customer-related processes",
        description: "Determination of requirements related to product and review of requirements.",
        requirementText: "The organization shall determine requirements specified by the customer, including requirements for delivery and post-delivery activities.",
        mandatory: true,
        riskLevel: "medium",
        tags: ["Sales", "Customer"]
      }
    ],
    isActive: true,
    uuid: "cbe85061-c256-4eba-9172-e3c1a72c17d3"
  }
];

const seed = async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected.");

    // Find the first user in the Auth collection to associate the framework creation with
    const firstUser = await Auth.findOne();
    const createdByUserId = firstUser ? firstUser._id : null;
    if (createdByUserId) {
      console.log(`ℹ️ Frameworks will be created under user ID: ${createdByUserId} (${firstUser.email})`);
    } else {
      console.log("⚠️ No users found in 'Auth' collection. Frameworks will be created without 'createdBy'.");
    }

    for (const fData of frameworksData) {
      console.log(`\n----------------------------------------`);
      console.log(`📦 Processing framework: ${fData.name} (${fData.shortCode})...`);

      // Check if it already exists by shortCode
      const existing = await Framework.findOne({ shortCode: fData.shortCode.toUpperCase() });
      if (existing) {
        console.log(`ℹ️ Existing framework found (ID: ${existing._id}). Cleaning up old data...`);
        
        // 1. Delete associated points from Qdrant
        try {
          console.log(`🧹 Deleting old points for framework ${existing._id} from Qdrant...`);
          await qdrantClient.delete("frameworks", {
            filter: {
              must: [
                {
                  key: "frameworkId",
                  match: {
                    value: existing._id.toString(),
                  },
                },
              ],
            },
          });
          console.log(`✅ Qdrant old points deleted.`);
        } catch (qErr) {
          console.error(`⚠️ Error deleting old Qdrant points (it might not exist yet):`, qErr.message);
        }

        // 2. Delete from MongoDB
        await Framework.deleteOne({ _id: existing._id });
        console.log(`✅ Old MongoDB record deleted.`);
      }

      // Create new framework in MongoDB
      const frameworkPayload = {
        ...fData,
        createdBy: createdByUserId,
      };

      const newFramework = await Framework.create(frameworkPayload);
      console.log(`✅ Created new Framework in MongoDB with ID: ${newFramework._id}`);

      // Sync/Upsert to Qdrant Vector DB
      try {
        console.log(`🧬 Generating embeddings and syncing to Qdrant...`);
        const chunks = chunkFramework(newFramework);
        let count = 0;

        for (const chunk of chunks) {
          const vector = await generateEmbedding(chunk.text);
          await qdrantClient.upsert("frameworks", {
            wait: true,
            points: [
              {
                id: randomUUID(),
                vector: vector,
                payload: {
                  text: chunk.text,
                  ...chunk.metadata,
                },
              },
            ],
          });
          count++;
        }
        console.log(`✅ Successfully synced ${count} chunks/controls to Qdrant.`);
      } catch (vecErr) {
        console.error(`❌ Failed to sync to Qdrant vector DB:`, vecErr);
      }
    }

    console.log(`\n🎉 Seeding completed successfully.`);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed.");
    process.exit(0);
  }
};

seed();
