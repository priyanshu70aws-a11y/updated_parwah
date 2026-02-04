const express = require('express');
const { eventBus } = require('../utils/eventBus');

const router = express.Router();

router.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const sendEvent = (payload) => {
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };

  sendEvent({ event: 'connected', message: 'Realtime stream connected' });

  const handler = (payload) => sendEvent(payload);
  eventBus.on('complaint.created', handler);
  eventBus.on('complaint.updated', handler);
  eventBus.on('comment.created', handler);
  eventBus.on('vote.updated', handler);

  req.on('close', () => {
    eventBus.off('complaint.created', handler);
    eventBus.off('complaint.updated', handler);
    eventBus.off('comment.created', handler);
    eventBus.off('vote.updated', handler);
  });
});

module.exports = router;
