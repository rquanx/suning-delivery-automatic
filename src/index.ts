import { intro, outro } from '@clack/prompts';
import { isCancel, cancel, text } from '@clack/prompts';

intro(`create-my-app`);
outro(`You're all set!`);

const value = await text({
  message: 'What is the meaning of life?',
});


if (isCancel(value)) {
  cancel('Operation cancelled.');
  process.exit(0);
}

