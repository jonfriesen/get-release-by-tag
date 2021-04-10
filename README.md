# WARNING

CURRENTLY THIS LIBRARY SETS ONE OUTPUT WHICH IS THE URL_UPLOAD FROM THE RELEASE.

# Foreword
This project was inspired by official GitHub Actions projects (such as the ones used as examples in this document). I'd like to extend a special thanks to all of the contributors who made this Action possible.

# GitHub Action - Releases API
This GitHub Action (written in JavaScript) wraps the [GitHub Release API](https://developer.github.com/v3/repos/releases/), specifically the [Upload a Release Asset](https://developer.github.com/v3/repos/releases/#upload-a-release-asset) endpoint, to allow you to leverage GitHub Actions to upload release assets.

<a href="https://github.com/jonfriesen/get-release-by-tag"><img alt="GitHub Actions status" src="https://github.com/jonfriesen/get-release-by-tag/workflows/Tests/badge.svg"></a>

## Usage
### Pre-requisites
Create a workflow `.yml` file in your repositories `.github/workflows` directory. An [example workflow](#example-workflow---upload-a-release-asset) is available below. For more information, reference the GitHub Help Documentation for [Creating a workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file). You also will need to have a release to upload your asset to, which could be created programmatically by [`@actions/create-release`](https://www.github.com/actions/create-release) as show in the example workflow.

### Input
For more information on these inputs, see the [API Documentation](https://developer.github.com/v3/repos/releases/#input-2)

- `tag_name`: Tag to get a release for, which could come from another GitHub Action, for example the [`@actions/create-release`](https://www.github.com/actions/create-release) GitHub Action or a core reference (eg. `tag_name: ${{ github.ref }}`)

### Outputs
For more information on these outputs, see the [API Documentation](https://developer.github.com/v3/repos/releases/#get-a-release-by-tag-name) for an example of what these outputs look like.

### Example workflow - upload a release asset
On every `push` to a tag matching the pattern `v*`, [create a release](https://developer.github.com/v3/repos/releases/#create-a-release) and [upload a release asset](https://developer.github.com/v3/repos/releases/#upload-a-release-asset). This Workflow example assumes you have the [`@actions/create-release`](https://www.github.com/actions/create-release) Action in a previous step:

```yaml
on:
  push:
    # Sequence of patterns matched against refs/tags
    tags:
    - 'v*' # Push events to matching v*, i.e. v1.0, v20.15.10

name: Upload Release Asset

jobs:
  build:
    name: Upload Release Asset
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@master
      - name: Build project # This would actually build your project, using zip for an example artifact
        run: |
          zip --junk-paths my-artifact README.md
      - name: Create Release
        id: create_release
        uses: actions/create-release@v1.0.0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          draft: false
          prerelease: false
      - name: Get Release by Tag
        id: get_release_by_tag
        uses: jonfriesen/get-release-by-tag@v0.0.11
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
      - name: Upload Release Asset
        id: upload-release-asset 
        uses: actions/upload-release-asset@v1.0.1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          upload_url: ${{ steps.get_release_by_tag.outputs.release.data.upload_url }} # This pulls from the GET RELEASE BY TAG step above, referencing it's ID to get its release object, which include a `upload_url`. See this blog post for more info: https://jasonet.co/posts/new-features-of-github-actions/#passing-data-to-future-steps 
          asset_path: ./my-artifact.zip
          asset_name: my-artifact.zip
          asset_content_type: application/zip
```

This will upload a release artifact to an existing release, outputting the `browser_download_url` for the asset which could be handled by a third party service, or by GitHub Actions for additional uses. For more information, see the GitHub Documentation for the [upload a release asset](https://developer.github.com/v3/repos/releases/#upload-a-release-asset) endpoint. 

## Contributing
We would love you to contribute to `@jonfriesen/get-release-by-tag`, pull requests are welcome! Please see the [CONTRIBUTING.md](CONTRIBUTING.md) for more information.

## License
The scripts and documentation in this project are released under the [MIT License](LICENSE)
