import { Octokit } from "octokit";
import { Command, Option } from "commander";

const repositories = [
  "care-yoda-bo-front",
  "care-yoda-service",
  "care-player-activity-service",
  "care-kyc-service",
  "care-kyc-worker",
  "care-risk-service",
  "care-risk-worker",
  "care-gdpr-worker",
  "care-mails-import-worker",
  "care-yoda-backend-service",
  "care-internal-tools",
  "care-doc-operations",
  "care-supervision-dashboard",
];

// ----------
async function run(owner, access_token) {
  console.log("🔎 Start listing branch optimization!");

  const octokit = new Octokit({
    auth: access_token,
  });

  var nbBranchesToClean = 0;
  for (const repo of repositories) {
    nbBranchesToClean = 0;
    var branches = await _getBranches(octokit, owner, repo);

    console.log(repo);
    for (const [i, branch] of branches.entries()) {
      if (i === branches.length - 1) {
        console.log(`└── ${branch.name}`);
      } else {
        console.log(`├── ${branch.name}`);
      }

      if (branch.name !== "master" && !branch.name.startsWith("release")) {
        nbBranchesToClean += 1;
      }
    }

    if (nbBranchesToClean > 0) {
      console.log(`==> ❌ Number of branches to delete ${nbBranchesToClean}`);
    } else {
      console.log(`==> ✅ Everything is fine!`);
    }

    console.log();
  }

  console.log("✅ Listing branch done!");
}

async function _getBranches(octokit, owner, repo) {
  const response = await octokit.request("GET /repos/{owner}/{repo}/branches", {
    owner: owner,
    repo: repo,
    per_page: 100,
  });

  return response.data;
}

// ----------
const program = new Command();

program
  .name("github-brancher")
  .description("CLI to list repositories branchs.")
  .version("0.0.1")

  .addOption(new Option("--owner <owner>", "owner").makeOptionMandatory())
  .addOption(new Option("--token <github_token>", "github token").makeOptionMandatory())

  .parse();

const options = program.opts();

run(options.owner, options.token);
