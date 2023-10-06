import { Octokit } from "octokit";
import { Command, Option } from "commander";

const my_labels = [
  { name: "type:bug", description: "Something isn't working", color: "#795548" },
  { name: "type:enhancement", description: "New feature or request", color: "#00E676" },
  { name: "type:refactoring", description: "Code refactoring", color: "#8BC34A" },
  { name: "type:documentation", description: "Improvements or additions to documentation", color: "#039BE5" },
  { name: "type:dependencies", description: "Updates of dependencies", color: "#00E5FF" },

  { name: "priority:high", description: "High priority", color: "#FF1744" },
  { name: "priority:medium", description: "Medium priority", color: "#FF9100" },
  { name: "priority:low", description: "Low priority", color: "#FFEA00" },
];

// ----------
async function run(owner, repo, access_token) {
  console.log("🔎 Start labels optimization!");

  const octokit = new Octokit({
    auth: access_token,
  });

  var labels = await _getLabels(octokit, owner, repo);

  console.log(`==> Cleaning ${labels.length} labels...`);

  // Delete all existing labels not used
  await _deleteNotUsedLabels(octokit, owner, repo, labels);

  // Upsert labels
  await _upsertLabels(octokit, owner, repo, labels);

  console.log("✅ Labels optimization done!");
}

async function _getLabels(octokit, owner, repo) {
  const response = await octokit.request("GET /repos/{owner}/{repo}/labels", {
    owner: owner,
    repo: repo,
    per_page: 100,
  });

  return response.data;
}

async function _deleteNotUsedLabels(octokit, owner, repo, labels) {
  for (var label of labels) {
    var isUsed = my_labels.some((l) => l.name === label.name);
    if (!isUsed) {
      console.log(`==> Deleting unused label ${label.name}...`);
      await _deleteLabel(octokit, owner, repo, label);
    }
  }
}

async function _upsertLabels(octokit, owner, repo, labels) {
  for (var my_label of my_labels) {
    var isCreated = labels.some((l) => l.name === my_label.name);
    if (isCreated) {
      console.log(`==> Updating label ${my_label.name}...`);
      await _updateLabel(octokit, owner, repo, my_label);
    } else {
      console.log(`==> Creating label ${my_label.name}...`);
      await _createLabel(octokit, owner, repo, my_label);
    }
  }
}

async function _createLabel(octokit, owner, repo, label) {
  await octokit.request("POST /repos/{owner}/{repo}/labels", {
    owner: owner,
    repo: repo,
    name: label.name,
    color: label.color.replace(/^#/, ""),
    description: label.description,
  });
}

async function _updateLabel(octokit, owner, repo, label) {
  await octokit.request("PATCH /repos/{owner}/{repo}/labels/{name}", {
    owner: owner,
    repo: repo,
    name: label.name,
    color: label.color.replace(/^#/, ""),
    description: label.description,
  });
}

async function _deleteLabel(octokit, owner, repo, label) {
  await octokit.request("DELETE /repos/{owner}/{repo}/labels/{label}", {
    owner: owner,
    repo: repo,
    label: label.name,
  });
}

// ----------
const program = new Command();

program
  .name("github-labeler")
  .description("CLI to initialize labels of repository.")
  .version("0.0.1")

  .addOption(new Option("--owner <owner>", "owner").makeOptionMandatory())
  .addOption(new Option("--repo <repo_name>", "repository name").makeOptionMandatory())
  .addOption(new Option("--token <github_token>", "github token").makeOptionMandatory())

  .parse();

const options = program.opts();

run(options.owner, options.repo, options.token);
