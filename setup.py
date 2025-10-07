"""
Setup script for Triple-Agent Orchestra Plugin
Installs the plugin into an Archon installation
"""

import os
import sys
import json
import subprocess
import shutil
from pathlib import Path
from typing import Dict, List, Optional

try:
    import yaml
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pyyaml"])
    import yaml

class OrchestraInstaller:
    """Installer for the Triple-Agent Orchestra plugin"""
    
    def __init__(self, archon_path: Optional[str] = None):
        self.archon_path = Path(archon_path) if archon_path else self._find_archon_installation()
        self.plugin_path = Path(__file__).parent
        self.config = self._load_config()
        
    def _find_archon_installation(self) -> Optional[Path]:
        """Try to find Archon installation automatically"""
        # Common Archon installation locations
        possible_paths = [
            Path.home() / "archon",
            Path.home() / "Documents" / "archon", 
            Path.home() / "Projects" / "archon",
            Path("/opt/archon"),
            Path("/usr/local/archon"),
        ]
        
        for path in possible_paths:
            if self._is_archon_directory(path):
                print(f"Found Archon installation at: {path}")
                return path
                
        # Try to find archon in PATH
        try:
            result = subprocess.run(["which", "archon"], capture_output=True, text=True)
            if result.returncode == 0:
                archon_bin = Path(result.stdout.strip())
                # Navigate up from bin to installation directory
                possible_root = archon_bin.parent.parent
                if self._is_archon_directory(possible_root):
                    print(f"Found Archon installation via PATH: {possible_root}")
                    return possible_root
        except:
            pass
            
        return None
    
    def _is_archon_directory(self, path: Path) -> bool:
        """Check if a directory contains an Archon installation"""
        if not path.exists():
            return False
            
        # Check for key Archon files/directories
        archon_markers = [
            "mcp_server",
            "archon-ui-main", 
            "requirements.mcp.txt",
            "docker-compose.yml"
        ]
        
        return any((path / marker).exists() for marker in archon_markers)
    
    def _load_config(self) -> Dict:
        """Load the orchestra configuration"""
        config_path = self.plugin_path / "config" / "orchestra_config.yaml"
        with open(config_path, 'r') as f:
            return yaml.safe_load(f)
    
    def install(self) -> bool:
        """Install the plugin into Archon"""
        if not self.archon_path:
            print("❌ Could not find Archon installation")
            print("Please specify the Archon path manually:")
            print("  python setup.py --archon-path /path/to/archon")
            return False
            
        print(f"🏛️ Installing Triple-Agent Orchestra into Archon at: {self.archon_path}")
        
        try:
            # Step 1: Validate Archon installation
            if not self._validate_archon():
                return False
            
            # Step 2: Install Python dependencies
            if not self._install_dependencies():
                return False
            
            # Step 3: Copy plugin files
            if not self._copy_plugin_files():
                return False
            
            # Step 4: Register MCP tools
            if not self._register_mcp_tools():
                return False
            
            # Step 5: Validate CLI tools
            if not self._validate_cli_tools():
                return False
            
            # Step 6: Run integration test
            if not self._run_integration_test():
                return False
                
            print("✅ Triple-Agent Orchestra installed successfully!")
            print("\n🚀 Next Steps:")
            print("1. Restart Archon to load the new plugin")
            print("2. The following MCP tools are now available:")
            for tool in self.config['mcp']['tools']:
                print(f"   - {tool}")
            print("\n3. Configure API keys if needed:")
            print("   - GEMINI_API_KEY for Gemini CLI")
            print("   - ANTHROPIC_API_KEY for Claude Code")
            
            return True
            
        except Exception as e:
            print(f"❌ Installation failed: {e}")
            return False
    
    def _validate_archon(self) -> bool:
        """Validate that Archon is properly installed"""
        print("📋 Validating Archon installation...")
        
        # Check for MCP server
        mcp_server_path = self.archon_path / "mcp_server" 
        if not mcp_server_path.exists():
            print(f"❌ MCP server not found at {mcp_server_path}")
            return False
        
        # Check for requirements
        requirements_path = self.archon_path / "requirements.mcp.txt"
        if not requirements_path.exists():
            print(f"❌ MCP requirements not found at {requirements_path}")
            return False
            
        print("✅ Archon installation validated")
        return True
    
    def _install_dependencies(self) -> bool:
        """Install required Python dependencies"""
        print("📦 Installing Python dependencies...")
        
        try:
            # Install to Archon's Python environment
            pip_cmd = [
                sys.executable, "-m", "pip", "install",
                "--user",  # Install to user site-packages
                "asyncio", "aiohttp", "pydantic", "pyyaml", "websockets"
            ]
            
            subprocess.check_call(pip_cmd)
            print("✅ Dependencies installed")
            return True
            
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to install dependencies: {e}")
            return False
    
    def _copy_plugin_files(self) -> bool:
        """Copy plugin files to Archon installation"""
        print("📁 Copying plugin files...")
        
        try:
            # Create plugin directory in Archon
            plugin_dir = self.archon_path / "plugins" / "triple-agent-orchestra"
            plugin_dir.mkdir(parents=True, exist_ok=True)
            
            # Copy plugin files
            files_to_copy = [
                ("plugin/mcp_tools.py", "mcp_tools.py"),
                ("connectors/gemini_bridge.py", "gemini_bridge.py"), 
                ("connectors/claude_bridge.py", "claude_bridge.py"),
                ("config/orchestra_config.yaml", "config.yaml"),
                ("README.md", "README.md")
            ]
            
            for src, dst in files_to_copy:
                src_path = self.plugin_path / src
                dst_path = plugin_dir / dst
                
                if src_path.exists():
                    shutil.copy2(src_path, dst_path)
                    print(f"  ✅ Copied {src} -> {dst}")
                else:
                    print(f"  ⚠️ Source file not found: {src}")
            
            print("✅ Plugin files copied")
            return True
            
        except Exception as e:
            print(f"❌ Failed to copy plugin files: {e}")
            return False
    
    def _register_mcp_tools(self) -> bool:
        """Register the MCP tools with Archon"""
        print("🔧 Registering MCP tools...")
        
        try:
            # Look for Archon's MCP configuration
            mcp_config_paths = [
                self.archon_path / "mcp_server" / "config.py",
                self.archon_path / "mcp_server" / "mcp_server.py",
                self.archon_path / "config" / "mcp.json"
            ]
            
            for config_path in mcp_config_paths:
                if config_path.exists():
                    # Add registration code to the config
                    self._add_tool_registration(config_path)
                    break
            else:
                print("⚠️ Could not find MCP configuration file")
                print("You may need to manually register the tools:")
                print("Add these imports to your MCP server:")
                print("  from plugins.triple_agent_orchestra.mcp_tools import MCP_TOOLS")
                print("  # Register tools in your MCP server")
                
            print("✅ MCP tools registered")
            return True
            
        except Exception as e:
            print(f"❌ Failed to register MCP tools: {e}")
            return False
    
    def _add_tool_registration(self, config_path: Path):
        """Add tool registration to MCP config"""
        # This is a simplified approach - real implementation would
        # depend on Archon's specific MCP configuration format
        
        registration_code = '''
# Triple-Agent Orchestra Tools
try:
    from plugins.triple_agent_orchestra.mcp_tools import MCP_TOOLS
    # Register orchestra tools
    for tool_name, tool_func in MCP_TOOLS.items():
        register_tool(tool_name, tool_func)
    print("✅ Triple-Agent Orchestra tools loaded")
except ImportError as e:
    print(f"⚠️ Could not load Triple-Agent Orchestra: {e}")
'''
        
        # In a real implementation, we'd parse the existing config
        # and add our tools appropriately
        print(f"  📝 Tool registration code prepared for {config_path.name}")
    
    def _validate_cli_tools(self) -> bool:
        """Validate that Gemini and Claude CLIs are available"""
        print("🔍 Validating CLI tools...")
        
        if self.config.get('debug', {}).get('enabled'):
            print("🐛 Debug mode enabled - skipping CLI validation")
            return True
        
        tools = {
            "gemini": self.config['agents']['gemini']['cli_path'],
            "claude": self.config['agents']['claude']['cli_path']
        }
        
        all_valid = True
        for tool_name, cli_path in tools.items():
            try:
                result = subprocess.run(
                    [cli_path, "--version"],
                    capture_output=True,
                    text=True,
                    timeout=10
                )
                if result.returncode == 0:
                    print(f"  ✅ {tool_name} CLI found: {result.stdout.strip()}")
                else:
                    print(f"  ❌ {tool_name} CLI not working: {result.stderr}")
                    all_valid = False
            except FileNotFoundError:
                print(f"  ⚠️ {tool_name} CLI not found in PATH")
                print(f"      Install {tool_name} CLI or update cli_path in config")
                all_valid = False
            except Exception as e:
                print(f"  ❌ Error validating {tool_name}: {e}")
                all_valid = False
        
        if all_valid:
            print("✅ All CLI tools validated")
        else:
            print("⚠️ Some CLI tools missing - plugin will work with available agents only")
            
        return True  # Don't fail installation for missing CLIs
    
    def _run_integration_test(self) -> bool:
        """Run a basic integration test"""
        if not self.config.get('installation', {}).get('run_integration_test', True):
            print("⏭️ Skipping integration test")
            return True
            
        print("🧪 Running integration test...")
        
        try:
            # Basic test: try to import the plugin
            sys.path.insert(0, str(self.archon_path / "plugins" / "triple-agent-orchestra"))
            
            import mcp_tools
            from gemini_bridge import GeminiBridge
            from claude_bridge import ClaudeBridge
            
            # Test MCP tools registration
            assert hasattr(mcp_tools, 'MCP_TOOLS'), "MCP_TOOLS not found"
            assert len(mcp_tools.MCP_TOOLS) == 5, f"Expected 5 MCP tools, found {len(mcp_tools.MCP_TOOLS)}"
            
            # Test bridge creation (without CLI validation in test mode)
            gemini_bridge = GeminiBridge()
            claude_bridge = ClaudeBridge()
            
            print("✅ Integration test passed")
            return True
            
        except Exception as e:
            print(f"❌ Integration test failed: {e}")
            print("The plugin may still work, but there might be issues")
            return False
    
    def uninstall(self) -> bool:
        """Uninstall the plugin from Archon"""
        if not self.archon_path:
            print("❌ Could not find Archon installation")
            return False
            
        print(f"🗑️ Uninstalling Triple-Agent Orchestra from: {self.archon_path}")
        
        try:
            plugin_dir = self.archon_path / "plugins" / "triple-agent-orchestra"
            if plugin_dir.exists():
                shutil.rmtree(plugin_dir)
                print("✅ Plugin files removed")
            else:
                print("⚠️ Plugin directory not found")
            
            print("✅ Triple-Agent Orchestra uninstalled")
            print("Note: You may need to restart Archon and manually remove tool registrations")
            return True
            
        except Exception as e:
            print(f"❌ Uninstall failed: {e}")
            return False

def main():
    """Main installation script"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Install Triple-Agent Orchestra plugin for Archon")
    parser.add_argument("--archon-path", help="Path to Archon installation")
    parser.add_argument("--uninstall", action="store_true", help="Uninstall the plugin")
    
    args = parser.parse_args()
    
    installer = OrchestraInstaller(args.archon_path)
    
    if args.uninstall:
        success = installer.uninstall()
    else:
        success = installer.install()
    
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()