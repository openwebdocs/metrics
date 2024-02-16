# metrics

Package to retrieve, analyze, and show OWD-relevant metrics.

## Set up & usage

You can fetch and store raw GitHub API data:

- `npm run fetch-prs <repo>` to get all PRs of a repo.
  - Example: `npm run fetch-prs mdn/content`
- `npm run fetch-reviews <repo> <year>` to get all reviews (excluding comment reviews) in the given year
  - Example: `npm run fetch-reviews mdn/content 2023`

> [!NOTE]
> Fetching data from the GitHub API requires a [GitHub Personal access token](https://github.com/settings/tokens). Generate your token and put it in the `.env` file (rename the `.env-dist` file).

## Available metrics

You can gather the following metrics:

- `npm run metric-merged-prs <repo> <year>` to show the number of merged PRs per PR author for a repository. The year filter is optional.
- `npm run metric-reviewers <repo> <year> <cohort>` to show the number reviews for a repository. The year filter is optional. The cohort filter is optional and can be used to only take into account reviews performed on PRs authored by non-maintainers ("community PRs").

## Working with large file storage (Git LFS)

Files in the `raw-data` folder use Git LFS. Make sure to [install Git LFS](https://docs.github.com/en/repositories/working-with-files/managing-large-files/installing-git-large-file-storage).

Once installed, you can mark files for Git LFS:

```bash
git lfs track raw-data/new-data-source.json
```

Now you can commit the file as usual and GitHub will upload it to a large file storage.

```bash
git add raw-data/new-data-source.json
git commit -m "Adding new LFS data source"
git push 
> Uploading LFS objects: 100% (1/1), 409 MB | 1.3 MB/s, done. 
```

The files marked for Git LFS should appear in the `.gitattributes` file and you should commit changes to this file, too.

See also [Managing large files](https://docs.github.com/en/repositories/working-with-files/managing-large-files) in the GitHub docs.
