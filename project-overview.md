# Project Overview

## Overview

The goal of this practice is to implement a conversational AI application with two primary functionalities: synthetic data generation and natural language data querying. This task is broken down into 3 distinct phases:

- Phase 1 involves developing a core data generation engine. This engine must interpret the provided SQL schemas, identifying tables, columns, data types, and constraints. A data generation module will then use this parsed information to create realistic synthetic data, respecting all defined constraints, especially foreign keys, to ensure data integrity. The system should be capable of generating a configurable amount of data, for instance, a thousand rows per table.

- Phases 2 and 3 focus on implementing the Conversational Core module, which allows users to query SQL data using natural language (talk-to-your-data) and present results in the form of text, tables, and plots.

Functional Requirements:

Phase 1: Synthetic Data Generation

- The system should generate consistent and valid data for the provided DDL schema (up to 5-7 Tables) and instructions [data types, null values, date and time formats, primary and foreign keys, etc].

- The system should allow a user to modify the data through textual feedback from the user.

- Generated data can be downloaded as csv / zip archive and stored in the system so that later it is accessible in ‘Talk to you data’ tab.

UI requirements:

1. Sidebar for main tabs: Data Generation, Talk to your data.

2. Data Generation tab:

User can upload as a file with DDL schema (.sql, .txt or .ddl file)

User can add text instructions (prompt) for the data in a text box

User can set additional generation parameters, such as temperature

Generation happens after user clicks “Generate” button

After data is generated, user can check the preview for each of the generated tables

User can apply changes for each of the tables by entering the prompt and clicking Submit button

Phase 2: Chat with Your Data

The system shall provide a conversational interface that allows users to interact with the data using natural language text input.

1. The system should display the conversation history and stream system responses.

2. The system should automatically generate and execute relevant SQL queries against the underlying data source(s).

SQL Joins and Aggregation functions are supported

Both the source query and tabular output are provided in the output

[optional] Queries are modifiable from the UI (?)

3. The system should generate data visualisations using the Python Seaborn library (or similar) and provide the results within the conversational interface.

Implement basic guardrails:

- Detect prompt injection / jailbreaks attempts.

- Make sure your AI assistant stays on topic.

- Optional (if relevant for your schema): PII data tokenization (masking) for user queries.

Observability

- Setup Langfuse and connect it to your application (for tracing):

You can also try to setup some alerts for jailbreak attempts and online evals

The "Phase 1: Synthetic Data Generation" workflow is focused on taking a schema and instructions from the user, generating realistic synthetic data, allowing the user to refine it, and finally storing the result.

The process is divided into three main stages: _Input & Configuration, **Generation, and **Review & Refinement_.
