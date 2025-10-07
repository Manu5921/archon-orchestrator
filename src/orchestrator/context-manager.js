import fs from 'fs/promises';
import path from 'path';
import { logger } from '../utils/logger.js';

export class ContextManager {
  constructor() {
    this.contexts = new Map();
    this.syncHistory = [];
    this.storagePath = path.join(process.cwd(), 'data', 'contexts');
  }
  
  async store(contextType, data) {
    const contextId = `${contextType}_${Date.now()}`;
    
    const contextEntry = {
      id: contextId,
      type: contextType,
      data,
      created_at: new Date().toISOString(),
      size_bytes: JSON.stringify(data).length
    };
    
    this.contexts.set(contextId, contextEntry);
    
    // Persist to disk for recovery
    await this.persistContext(contextId, contextEntry);
    
    logger.debug(`Stored context ${contextId} (${contextEntry.size_bytes} bytes)`);
    
    return contextId;
  }
  
  async retrieve(contextId) {
    let context = this.contexts.get(contextId);
    
    if (!context) {
      // Try to load from disk
      context = await this.loadContext(contextId);
    }
    
    return context?.data || null;
  }
  
  async merge(contexts) {
    const merged = {};
    
    for (const contextId of contexts) {
      const data = await this.retrieve(contextId);
      if (data) {
        Object.assign(merged, data);
      }
    }
    
    return merged;
  }
  
  async persistContext(contextId, context) {
    try {
      await fs.mkdir(this.storagePath, { recursive: true });
      const filePath = path.join(this.storagePath, `${contextId}.json`);
      await fs.writeFile(filePath, JSON.stringify(context, null, 2));
    } catch (error) {
      logger.error(`Failed to persist context ${contextId}:`, error);
    }
  }
  
  async loadContext(contextId) {
    try {
      const filePath = path.join(this.storagePath, `${contextId}.json`);
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      logger.debug(`Context ${contextId} not found on disk`);
      return null;
    }
  }
  
  async cleanup(olderThanMs = 24 * 60 * 60 * 1000) {
    const now = Date.now();
    const toDelete = [];
    
    for (const [id, context] of this.contexts) {
      const age = now - new Date(context.created_at).getTime();
      if (age > olderThanMs) {
        toDelete.push(id);
      }
    }
    
    for (const id of toDelete) {
      this.contexts.delete(id);
      try {
        const filePath = path.join(this.storagePath, `${id}.json`);
        await fs.unlink(filePath);
      } catch (error) {
        // File might not exist
      }
    }
    
    logger.debug(`Cleaned up ${toDelete.length} old contexts`);
  }
  
  recordSync(agents, contextType, dataSize) {
    this.syncHistory.push({
      agents,
      context_type: contextType,
      data_size: dataSize,
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 1000 sync records
    if (this.syncHistory.length > 1000) {
      this.syncHistory = this.syncHistory.slice(-1000);
    }
  }
  
  getSyncStats() {
    const stats = {
      total_syncs: this.syncHistory.length,
      contexts_stored: this.contexts.size,
      sync_frequency: {},
      avg_data_size: 0
    };
    
    let totalSize = 0;
    
    for (const sync of this.syncHistory) {
      stats.sync_frequency[sync.context_type] = 
        (stats.sync_frequency[sync.context_type] || 0) + 1;
      totalSize += sync.data_size;
    }
    
    if (this.syncHistory.length > 0) {
      stats.avg_data_size = Math.round(totalSize / this.syncHistory.length);
    }
    
    return stats;
  }
}