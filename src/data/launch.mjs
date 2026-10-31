/** Return actionable launch blockers. Shared by config, CLI, and tests. */
export function launchIssues(business) {
  const issues = [];
  for (const field of [
    'practitionerName',
    'practitionerBio',
    'email',
    'phone',
    'streetAddress',
    'postalCode',
    'city',
    'directions',
  ]) {
    if (typeof business[field] !== 'string' || !business[field].trim())
      issues.push(`Missing ${field}`);
  }
  if (business.addressConfirmed !== true)
    issues.push('The provisional address must be confirmed');
  if (business.bookingUrlConfirmed !== true)
    issues.push('The final practitioner booking URL must be confirmed');
  if (!isHttpsUrl(business.bookingUrl))
    issues.push('A valid HTTPS bookingUrl is required');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(business.email ?? ''))
    issues.push('A valid email is required');
  if (business.copyApproved !== true)
    issues.push('Swedish copy must be approved');
  if (business.launchReady !== true)
    issues.push('launchReady must be explicitly enabled');
  if (!Array.isArray(business.treatments) || !business.treatments.length)
    issues.push('At least one confirmed treatment is required');
  for (const treatment of Array.isArray(business.treatments)
    ? business.treatments
    : []) {
    if (!treatment || typeof treatment !== 'object') {
      issues.push('Invalid treatment entry');
      continue;
    }
    if (!treatment.confirmed)
      issues.push(`Unconfirmed treatment: ${treatment.id}`);
    if (!treatment.name?.trim() || !treatment.description?.trim())
      issues.push(`Missing treatment copy: ${treatment.id}`);
    if (
      !Number.isInteger(treatment.durationMinutes) ||
      treatment.durationMinutes <= 0
    )
      issues.push(`Missing duration: ${treatment.id}`);
    if (!Number.isFinite(treatment.priceSek) || treatment.priceSek <= 0)
      issues.push(`Missing price: ${treatment.id}`);
    if (treatment.bookingUrl !== null && !isHttpsUrl(treatment.bookingUrl))
      issues.push(`Invalid treatment booking URL: ${treatment.id}`);
  }
  return issues;
}

export function isHttpsUrl(value) {
  try {
    const url = new URL(value);
    return (
      url.protocol === 'https:' &&
      Boolean(url.hostname) &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

export function assertLaunchReady(business) {
  const issues = launchIssues(business);
  if (issues.length)
    throw new Error(
      `Armonia is not ready for public launch:\n- ${issues.join('\n- ')}`,
    );
}
