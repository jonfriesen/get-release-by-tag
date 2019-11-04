jest.mock('@actions/core');
jest.mock('@actions/github');

const core = require('@actions/core');
const { GitHub, context } = require('@actions/github');
const run = require('../src/get-release-by-tag');

/* eslint-disable no-undef */
describe('Get Release by Tag', () => {
  let getReleaseByTag;

  beforeEach(() => {
    getReleaseByTag = jest.fn().mockReturnValueOnce({
      data: {
        upload_url: 'http://some.url'
      }
    });

    context.repo = {
      owner: 'owner',
      repo: 'repo'
    };

    const github = {
      repos: {
        getReleaseByTag
      }
    };

    GitHub.mockImplementation(() => github);
  });

  test('Get release by tag endpoint is called', async () => {
    core.getInput = jest.fn().mockReturnValueOnce('refs/tags/v1.0.0');

    await run();

    expect(getReleaseByTag).toHaveBeenCalled();

    // expect(getReleaseByTag).toHaveBeenCalledWith({
    //   owner: context.repo.owner,
    //   repo: context.repo.repo,
    //   tag: 'refs/tags/v1.0.0'
    // });
  });

  // test('Output is set', async () => {
  //   core.getInput = jest.fn().mockReturnValueOnce('tag_name');

  //   core.setOutput = jest.fn();

  //   await run();

  //   expect(core.setOutput).toHaveBeenNthCalledWith(1, 'release', 'releaseRawr');
  // });

  // test('Action fails elegantly', async () => {
  //   core.getInput = jest.fn().mockReturnValueOnce('tag_name');

  //   getReleaseByTag.mockRestore();
  //   getReleaseByTag.mockImplementation(() => {
  //     throw new Error('Error retrieving release');
  //   });

  //   core.setOutput = jest.fn();

  //   core.setFailed = jest.fn();

  //   await run();

  //   expect(getReleaseByTag).toHaveBeenCalled();
  //   expect(core.setFailed).toHaveBeenCalledWith('Error getting release');
  //   expect(core.setOutput).toHaveBeenCalledTimes(0);
  // });
});
