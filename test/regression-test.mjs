#!/usr/bin/env node
import { apiGet, apiPost, apiDelete, encId, runTest } from './test-utils.mjs';

const DIR = import.meta.dirname;

await runTest('gcp', DIR, async (ctx) => {
  let s = ctx.step('Create GCP diagram');
  let diagramId;
  try {
    const res = await apiPost('/api/gcp/diagrams', { name: 'Test GCP' });
    diagramId = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create user');
  let userId;
  try {
    const res = await apiPost('/api/gcp/elements', { diagramId, type: 'GCPUser', name: 'Client', x1: 50, y1: 100, x2: 150, y2: 180 });
    userId = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create product');
  let prodId;
  try {
    const res = await apiPost('/api/gcp/elements', { diagramId, type: 'GCPProduct', name: 'Cloud Run', x1: 250, y1: 100, x2: 380, y2: 180 });
    prodId = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create service');
  let svcId;
  try {
    const res = await apiPost('/api/gcp/elements', { diagramId, type: 'GCPService', name: 'Cloud SQL', x1: 480, y1: 100, x2: 610, y2: 180 });
    svcId = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create path: User → CloudRun');
  try {
    await apiPost('/api/gcp/paths', { diagramId, sourceId: userId, targetId: prodId });
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create path: CloudRun → CloudSQL');
  try {
    await apiPost('/api/gcp/paths', { diagramId, sourceId: prodId, targetId: svcId });
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  await ctx.layoutDiagram(diagramId);
  await ctx.exportDiagram(diagramId, 'Export GCP image');

  s = ctx.step('Delete diagram');
  try {
    await apiDelete(`/api/gcp/diagrams/${encId(diagramId)}`);
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }
});
