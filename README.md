# Campus Resource Booking & Waitlist System

## ⚠️ The Problem
Imagine it's finals week. A study group of five students desperately needs a collaborative space to work on their final project. They walk across campus to the library, only to find every study room occupied. They check the online portal, but it only shows what is currently booked—there is no way to reserve a spot in line if a room becomes available. Meanwhile, another student who booked a room two weeks ago decides to study at home but forgets to cancel. The room sits empty for two hours while the study group sits on the floor in the hallway. 

This is a massive inefficiency that plagues university campuses everywhere: **Resource hoarding, lack of real-time availability, and the absence of a fair queuing system.**

## 💡 The Solution
The Campus Resource Booking System is a centralized, real-time platform that completely solves the resource allocation problem on university campuses. It allows students to view the live availability of study rooms, laboratories, sports facilities, and equipment, and reserve them instantly. 

More importantly, it introduces an **Automated Waitlist Engine**. If a desired resource is fully booked, a student can join the waitlist. The moment the original booking is cancelled or rejected, the system atomically promotes the first student on the waitlist, securing the resource for them and maximizing campus utilization.

## 🚀 Our Approach
We designed this system with two primary principles in mind: **Fairness** and **Frictionless User Experience**.

1. **Role-Based Access**: The platform separates concerns between Students (who browse and request resources) and Administrators (who oversee campus logistics, approve sensitive requests, and manage capacity).
2. **Atomic Waitlist Promotion**: To prevent race conditions (multiple students trying to grab a cancelled slot at the exact same millisecond), the backend utilizes secure database transactions. When a spot opens, the system guarantees that the next person in the queue gets it.
3. **Premium Dashboard UI**: Students interact with a sleek, glassmorphic dashboard that provides a clear overview of their confirmed bookings, pending requests, and waitlist positions at a single glance.

## 🛠️ Tech Stack
This platform is built as a modern, high-performance web application utilizing the following technologies:

- **Frontend Environment**: React (via Vite)
- **Styling**: Tailwind CSS & Framer Motion (for fluid, micro-animations)
- **Backend API**: Node.js & Express.js (written in TypeScript)
- **Database**: PostgreSQL (managed and queried via Prisma ORM)
- **Authentication**: Firebase Auth (seamless Google/Email integration)

## 📊 System Overview
The system is divided into three core pillars:
- **Resource Management**: Categorized resources (Rooms, Labs, Equipment) with specific time slots, capacities, and facility rules.
- **Booking Engine**: Handles immediate reservations for available slots and tracks the state of the request (Pending vs. Confirmed).
- **Waitlist Engine**: A FIFO (First-In, First-Out) queuing system that actively monitors slot capacities and auto-promotes users the exact second a resource becomes available.
