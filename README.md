Project Name: StudyMate

Description: StudyMate is an AI-powered learning platform designed to help students organize learning resources, track knowledge freshness, and generate structured study notes in a handwritten-style format. It combines topic-based knowledge retrieval with AI-assisted note generation to make studying more organized and efficient.

2. Problem & Solution Overview

Problem:

Students often spend significant time searching for study materials and converting large amounts of information into concise, understandable notes. When the underlying knowledge sources are outdated or difficult to locate, the relevance and accuracy of generated notes can also be affected.

Solution:

StudyMate provides a centralized platform for adding study topics, retrieving relevant knowledge from Wikipedia, tracking the freshness of knowledge graph data, and generating structured notes with AI assistance.

The project focuses on making learning resources easier to discover, organize, and convert into revision-friendly study material.

3. Working Demo / Live Link

Live Demo: https://ujjwallty.github.io/studymate-note/

GitHub Repository: https://github.com/ujjwallTY/studymate-note

The live demo hosts the frontend through GitHub Pages. Backend-dependent AI features require the backend to be deployed and configured correctly.

4. Technologies & AI Tools Used

HTML: Website structure and content.

CSS: Interface styling and layout.

JavaScript: User interactions and application logic.

Wikipedia API: Topic discovery and knowledge retrieval.

Gemini AI: AI-assisted generation of structured study notes.

Cloudflare Workers: Backend request handling and secure API integration.

GitHub: Source-code management and version control.

GitHub Pages: Frontend hosting and live demonstration.

5. Project Evolution Through Both Challenge Cards

Challenge Card 1 — Building the Core Learning Experience

The first stage focused on developing the StudyMate concept into a functional learning platform. The objective was to create an interface where students could add topics, retrieve relevant knowledge, and generate structured study notes.

This stage established the core workflow and the foundation for AI-assisted learning.

Challenge Card 2 — Improving Knowledge Freshness and Topic Retrieval

The second stage focused on improving the reliability of the knowledge used by the handwritten notes generator.

The project explored how the freshness and relevance of knowledge graph data could influence the quality of generated notes. It also highlighted the importance of robust topic retrieval, because users may enter a topic without knowing its exact Wikipedia page title.

This led to an improvement in topic discovery so the application could search for matching Wikipedia articles instead of relying exclusively on exact page titles.

6. Build Log / Decision Log

Development Log

Defined the problem of time-consuming study preparation and the need for structured revision material.

Designed and developed the StudyMate frontend.

Integrated topic-based knowledge retrieval using Wikipedia.

Developed the workflow for AI-assisted study-note generation.

Introduced a knowledge-freshness concept to improve awareness of how current the underlying information is.

Published the frontend using GitHub Pages and stored the project source code in a public GitHub repository.

Identified an issue where topic searches failed when users entered titles that did not exactly match Wikipedia page names.

Prepared an improvement to search for matching article titles rather than relying only on exact-title lookup.

Key Technical Decisions

Wikipedia for knowledge retrieval: Chosen as an accessible source for topic-related information.

Gemini AI for note generation: Selected to support the transformation of retrieved information into structured learning material.

Knowledge freshness tracking: Included to help assess whether underlying information may need updating.

GitHub Pages for frontend hosting: Used for straightforward deployment and sharing of the project.

Cloudflare Workers for backend handling: Intended to keep AI API requests and secrets outside the public frontend code.
