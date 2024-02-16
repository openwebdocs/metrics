# metrics

Package to retrieve, analyze, and show OWD-relevant metrics.

## Available metrics

TBD

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
