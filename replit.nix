{ pkgs }: {
	deps = [
		pkgs.htop
  pkgs.killall
  pkgs.killall
  pkgs.nodejs-18_x
    pkgs.nodePackages.typescript-language-server
    pkgs.yarn
    pkgs.replitPackages.jest
	];
}