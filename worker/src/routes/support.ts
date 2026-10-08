import { Hono } from 'hono';
import { z } from 'zod';
import { ok, badRequest, serverError, tooManyRequests } from '../utils/response';
import { log } from '../utils/logger';
import { supportRequestSchema } from '../validation/support';

const supportRouter = new Hono<{
  Bindings: {
    SUPABASE_URL: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
  };
  Variables: {
    supabase: any;
  };
}>();

supportRouter.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = supportRequestSchema.safeParse(body);

    if (!parsed.success) {
      return badRequest(c, parsed.error.errors.map((e) => e.message).join('; '));
    }

    const data = parsed.data;
    const supabase = c.get('supabase');

    const { error } = await supabase.from('support_requests').insert({
      ...data,
      country: data.country || 'Kenya',
    });

    if (error) {
      log('error', { error: error.message, details: error.details });
      return serverError(c, 'Failed to submit support request');
    }

    return ok(c, { message: 'Support request submitted successfully' }, 201);
  } catch (e: any) {
    log('error', { error: e.message });
    return serverError(c, e.message);
  }
});

export default supportRouter;

