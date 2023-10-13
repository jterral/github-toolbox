import { Octokit } from "octokit";
import { Command, Option } from "commander";

// ----------
async function run(owner, repo, access_token, number_to_keep) {
  console.log("🗑️ Start actions cleaning!");

  const octokit = new Octokit({
    auth: access_token,
  });

  await _deleteWorkflows(octokit, owner, repo, number_to_keep);

  console.log("✅ Actions cleaning done!");
}

async function _deleteWorkflows(octokit, owner, repo, number_to_keep) {
  const response = await octokit.request("GET /repos/{owner}/{repo}/actions/runs", {
    owner: owner,
    repo: repo,
    per_page: 100,
  });

  var runs = response.data.workflow_runs;
  console.log(`==> Number of total runs ${runs.length}`);

  var workflow_i = 0;
  for (const [i, run] of runs.entries()) {
    workflow_i++;

    if (workflow_i <= number_to_keep) {
      console.log(`==> ignoring workflow #${run.run_number} from ${run.head_branch} at ${run.created_at}`);
      continue;
    }

    console.log(`==> deleting workflow #${run.run_number} from ${run.head_branch} at ${run.created_at}`);
    await _deleteWorkflow(octokit, owner, repo, run.id);
  }
}

async function _deleteWorkflow(octokit, owner, repo, workflow_id) {
  await octokit.request("DELETE /repos/{owner}/{repo}/actions/runs/{workflow_id}", {
    owner: owner,
    repo: repo,
    workflow_id: workflow_id,
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
  .addOption(new Option("-k, --keep <number_of_workflow>", "number of workflows to keep").default(1, "last one"))

  .parse();

const options = program.opts();

run(options.owner, options.repo, options.token, options.keep);
