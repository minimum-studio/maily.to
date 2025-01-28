'use server';
import { render } from '@maily-to/render';

export async function renderEmail(
  json: string,
  options?: { preview?: string; plainText?: boolean }
) {
  if (!json) {
    throw new Error('JSON is required');
  }
  const content = JSON.parse(json);
  return render(content, options);
}

globalThis.renderEmail = renderEmail;
