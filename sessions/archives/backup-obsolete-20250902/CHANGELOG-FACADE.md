# 🎭 ARCHON FAÇADE MCP - CHANGELOG

## Version 1.0.1 (2025-08-29)

### ✨ Features
- **Capability Gates**: Added intelligent Phase 2 skipping when Claude agent unavailable
- **agents.capabilities Tool**: New tool to query available agents dynamically
- **Idempotent Tasks**: External_id support for preventing duplicate task creation
- **Enhanced Argument Normalization**: Centralized aliases (match_count → top_k, query, project_id)
- **Search Code Examples**: New tool with multi-level fallbacks (RAG → Search → Tasks filter)

### 🔧 Improvements  
- **Strict Retry Policy**: Only retry on 5xx and network errors (no more infinite loops)
- **Structured Logging**: Full correlation ID traceability across all operations
- **Error Classification**: Clear distinction between retryable/non-retryable errors
- **Dynamic Agent Detection**: Environment-based agent availability (ORCHESTRA_AGENTS)

### 🐛 Bug Fixes
- **Project ID Mapping**: Fixed project creation response structure (flat not nested)
- **Workflow Lookup**: Correct project ID passing between phases
- **RAG Query Parameters**: Fixed query field mapping (query not q)
- **Validation Input**: Proper object structure for explore_project

### 🔄 Contract Changes
- **Version**: archon-mcp-contract/0.1.0 → 0.1.1
- **New Tools**: agents.capabilities, search_code_examples
- **New Fields**: external_id for tasks, agents object in capabilities
- **Enhanced Aliases**: Extended alias mapping for backward compatibility

---

## Version 1.0.0 (2025-08-29)

### 🎯 Initial Release
- **MCP Façade Pattern**: Clean abstraction between MCP protocol and REST API
- **Tool Suite**: ensure_project, explore_project, perform_rag_query, manageTask
- **Multi-Level Fallbacks**: Graceful degradation when capabilities unavailable  
- **Health Checking**: Comprehensive agent and service health validation
- **Archon Integration**: Full CRUD operations for projects, tasks, RAG queries

### 🏗️ Architecture
- **ChatGPT Strategy**: Surgical debugging with correlation IDs
- **Contract Compliance**: Full MCP standard 2024-11-05 compatibility
- **Resilient Design**: Network failures, API errors, missing capabilities handled
- **Performance**: <200ms API calls, efficient caching, connection pooling