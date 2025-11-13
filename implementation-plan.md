# Frontend Implementation Plan: Data Assistant

## 1. Technical Stack Overview

The frontend application will be built using a modern, scalable stack optimized for performance and maintainability.

| Category             | Technology                        | Rationale                                                                                                                            |
| :------------------- | :-------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| **Core Framework**   | **React (v19.x)**                 | Industry standard for building reactive user interfaces.                                                                             |
| **Language**         | **TypeScript (v5.x)**             | Provides static typing for increased code quality, error prevention, and better tooling.                                             |
| **Styling**          | **Tailwind CSS (v4.1)**           | Utility-first framework for rapid, consistent, and fully responsive styling. We will rely on standard color palettes for simplicity. |
| **Routing**          | **React Router DOM (v6)**         | Declarative navigation for a Single Page Application (SPA).                                                                          |
| **Form Management**  | **React Hook Form**               | High-performance library for handling form state and validation, used in the `GenerationForm`.                                       |
| **Schema Validation**| **Zod**                           | Declarative, type-safe schema validation.                                                                                            |
| **State Management** | **React `useState`/`useReducer`** | Local state will be sufficient for component-specific and screen-level data (e.g., generated tables).                                |

## 2. Component Architecture

The application will use a clear, modular architecture following a **Layout > Screen > Component** hierarchy.

### 2.1. Layout Layer (Persistent Structure)

- **`AppLayout.tsx`**: The top-level component defining the two-column grid (Sidebar and Main Content). It will contain the `Sidebar` and receive the currently active `Screen` component as its children (via React Router).
- **`Sidebar.tsx`**: Contains the persistent application title (`Data Assistant`) and the primary navigation links (`Data Generation` and `Talk to your data`), using `react-router-dom`'s `Link` and `useLocation` for active state tracking.

### 2.2. Screen Layer (Route Destinations)

- **`DataGenerationScreen.tsx` (Phase 1)**: Manages the state for synthetic data generation and holds the overall logic for the generation workflow.
- **`ChatScreen.tsx` (Phase 2)**: Manages the conversation state, input/output, and complex content rendering for the natural language data querying feature.

### 2.3. Component Layer (Reusability & Logic)

- **Phase 1 Components:**
  - `GenerationForm.tsx`: Handles prompt input, parameter settings (Temperature, Max Tokens), and DDL schema upload.
  - `DataPreviewPanel.tsx`: Renders the generated data in a tabular format and includes the `QuickInstructionForm`.
  - `QuickInstructionForm.tsx`: A simple form for sending textual feedback to modify data.
- **Phase 2 Components:**
  - `ChatHistory.tsx`: Renders the sequential list of message bubbles.
  - `MessageBubble.tsx`: A flexible component capable of rendering the various content types (text, table, code, image/plot).
  - `SQLCodeBlock.tsx`: Specific component for displaying the generated SQL query.

## 3. Phase 1: Synthetic Data Generation Implementation

**Goal:** Implement the data generation screen, handling file upload, parameters, and multi-table output preview.

| Step    | Component(s)               | Focus Area                  | Technical Detail                                                                                                                                                                         |
| :------ | :------------------------- | :-------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **3.1** | `App.tsx`, `AppLayout.tsx` | **Routing Setup**           | Finalize `BrowserRouter`, `AppLayout` wrapper, and `Routes` in `App.tsx`. Define default routes: `/` redirects to `/generate`.                                                           |
| **3.2** | `GenerationForm.tsx`       | **Form & Validation**       | Implement form fields using **React Hook Form** for controlled inputs. Attach handlers for prompt, temperature (slider), and max tokens (number).                                        |
| **3.3** | `GenerationForm.tsx`       | **File Handling**           | Implement the DDL schema file upload logic (using a hidden `<input type="file">` and a styled button trigger). Store the file object in component state.                                 |
| **3.4** | `DataGenerationScreen.tsx` | **API Integration**         | Define the function to call the generation API. This function must send the prompt, parameters, and the DDL file content. Handle the `isGenerating` state for button loading feedback.   |
| **3.5** | `DataPreviewPanel.tsx`     | **Data Parsing (CRITICAL)** | Implement a utility function to take the raw **CSV string data** from the API response and convert it into a structured **JSON array of objects** for React rendering.                   |
| **3.6** | `DataPreviewPanel.tsx`     | **UI & Interaction**        | Implement the table selection dropdown. Render the HTML table (`<table>`) dynamically based on the currently selected table data, ensuring headers (column names) are derived correctly. |
| **3.7** | `QuickInstructionForm.tsx` | **Modification Loop**       | Implement the small form for user feedback. This triggers the data modification function in the parent screen (simulated with a console log for now).                                    |

## 4. Phase 2: Talk to Your Data (Conversational Core) Implementation

**Goal:** Implement the multi-modal chat interface, including natural language input, conversation history, and rendering complex output types (SQL, Table, Plot).

| Step    | Component(s)                            | Focus Area                 | Technical Detail                                                                                                                                                        |
| :------ | :-------------------------------------- | :------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **4.1** | `ChatScreen.tsx`                        | **Base Chat UI**           | Set up the main layout: fixed input bar at the bottom and a large, scrollable area for `ChatHistory`.                                                                   |
| **4.2** | `ChatHistory.tsx`, `MessageBubble.tsx`  | **History Rendering**      | Implement `MessageBubble` to dynamically render user messages and system responses. Use a state array (`conversationHistory`) to store messages, roles, and content.    |
| **4.3** | `MessageBubble.tsx`, `SQLCodeBlock.tsx` | **Multi-Modal Output**     | `MessageBubble` must handle content types beyond simple text: **Code blocks** (for SQL queries) and **HTML Tables** (for tabular results).                              |
| **4.4** | `ChatScreen.tsx`                        | **Natural Language Input** | Implement the text input and submit button. On submission, append the user query to the history and trigger the NLM2SQL API function.                                   |
| **4.5** | `ChatScreen.tsx`                        | **Streaming Response**     | Set up logic to handle streamed API responses (if supported) or sequential API calls. This includes displaying a typing indicator (`...`).                              |
| **4.6** | `MessageBubble.tsx`                     | **Visualization Output**   | Implement a method to embed the visualization output (expected to be an image URL or base64 string from the backend) within the message bubble.                         |
| **4.7** | `ChatScreen.tsx`                        | **Guardrails**             | Integrate client-side visual indicators or alerts for detected jailbreak attempts (as required by the project definition, though primary detection occurs server-side). |

---
