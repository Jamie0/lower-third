import express, { Router } from 'express';

import app from './src/server';

export { app }
app.listen(process.env.PORT || 8086);
