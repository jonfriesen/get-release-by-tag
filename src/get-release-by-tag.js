const core = require('@actions/core');
const { GitHub, context } = require('@actions/github');

async function run() {
  try {
    // Get authenticated GitHub client (Ocktokit): https://github.com/actions/toolkit/tree/master/packages/github#usage
    const github = new GitHub(process.env.GITHUB_TOKEN);

    // Get the inputs from the workflow file: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
    const releaseTag = core.getInput('tag_name', { required: true });

    // Remove prefix on release tag
    const tag = releaseTag.replace('refs/tags/', '');
    const { owner, repo } = context.repo;

    core.info(`Getting release from tag: ${tag} for ${owner}/${repo}`);

    // Upload a release asset
    // API Documentation: https://developer.github.com/v3/repos/releases/#get-a-single-release-asset
    // Octokit Documentation: https://octokit.github.io/rest.js/#octokit-routes-repos-get-release-by-tag
    const release = await github.repos.getReleaseByTag({
      owner,
      repo,
      tag
    });

    // Set the output variable for use by other actions: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
    core.info(`Setting output formatted_tag: ${tag}`);
    core.setOutput('formatted_tag', tag);
    core.info(`Setting output upload_url: ${release.data.upload_url}`);
    core.setOutput('upload_url', release.data.upload_url);
  } catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = run;
