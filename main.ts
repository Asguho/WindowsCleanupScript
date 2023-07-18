async function getPackageIds() {
  const command = new Deno.Command("winget", {
    args: ["list"],
  });
  const output = await command.output();

  const lines = new TextDecoder().decode(output.stdout).split("\n").slice(2);
  const packages = lines.map((line) => {
    return line.split(/(\s{2,}|…\s)/);
  });
  console.error(new TextDecoder().decode(output.stderr));
  return packages.map((p) => p[2]);
}

async function uninstallAllPackages() {
  (await getPackageIds()).forEach(async (id) => {
    const command = new Deno.Command("winget", {
      args: ["uninstall", "--id", id, "--force", "--silent"],
    });
    const output = await command.output();
    console.error(new TextDecoder().decode(output.stderr));
    console.log(new TextDecoder().decode(output.stdout));
  });
}

async function installPackage(id: string) {
  await runCommand("winget", ["install", "-e", "--id", id, "--force", "--silent"]);
}

async function runCommand(command: string, args: string[]) {
  const output = await new Deno.Command(command, {
    args,
  }).output();
  console.error(new TextDecoder().decode(output.stderr));
  console.log(new TextDecoder().decode(output.stdout));
}

async function main() {
  //  await uninstallAllPackages();

  await runCommand("wsl", ["--install"]);

  [
    "Microsoft.WindowsTerminal",
    "Microsoft.VisualStudioCode",
    "Microsoft.PowerToys",
    "Discord.Discord",
    "Spotify.Spotify",
    "GitHub.GitHubDesktop",
    "Git.Git",
    "PrismLauncher.PrismLauncher",
    "WinSCP.WinSCP",
    "PuTTY.PuTTY",
    "Docker.DockerDesktop",
    "Google.Chrome",
    "Mozilla.Thunderbird",
    "Microsoft.PowerShell",
    "Mozilla.Firefox",
    "Microsoft.Office",
  ].forEach(async (id) => {
    await installPackage(id);
  });
}
