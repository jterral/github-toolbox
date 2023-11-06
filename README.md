# GitHub Toolbox

Welcome to the GitHub Toolbox!

## Features

### GitHub Brancher

Quickly list all branches in your repositories to get an overview of your project's development branches.

```bash
$> cd github-brancher
$> yarn install
$> yarn start --owner <OWNER> --token <ghp_TOKEN>
```

### GitHub Cleaner

Automatically delete old and unused workflows to maintain a clean and efficient development environment.

```bash
$> cd github-cleaner
$> yarn install
$> yarn start --owner <OWNER> --repo <REPO> --keep 3 --token <ghp_TOKEN>
```

### GitHub Labeler

Easily create and manage labels across your GitHub repositories to keep your issues and PRs organized.

```bash
$> cd github-labeler
$> yarn install
$> yarn start --owner <OWNER> --repo <REPO> --token <ghp_TOKEN>
```

## Security Note

> **Warning**
Keep your personal access tokens secure. Do not hard-code them into your scripts or share them in your codebase. Use environment variables or other secure methods for token management.

## Contribution

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

Don't forget to give the project a star! Thanks again!

## Support and Community

If you need assistance or want to discuss the project, you're welcome to drop us a message through GitHub Issues.

## License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details..
