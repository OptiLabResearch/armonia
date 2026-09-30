import business from '../src/data/business.json' with { type: 'json' };
import { launchIssues } from '../src/data/launch.mjs';

const issues = launchIssues(business);
if (issues.length) {
  console.error(`Public launch is blocked:\n- ${issues.join('\n- ')}`);
  process.exitCode = 1;
} else {
  console.log(
    'All business details and approvals are present. Ready for launch review.',
  );
}
