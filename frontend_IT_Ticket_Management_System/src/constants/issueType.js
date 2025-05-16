const options = [
    {
      label: "Network / Connectivity",
      value: "Network / Connectivity",
      subOptions: [
        {
          label: "Internet is very slow",
          value: "Network / Connectivity / Internet is very slow",
        },
        {
          label: "Weak Signal / Bad Signal",
          value: "Network / Connectivity / Weak Signal / Bad Signal",
        },
        {
          label: "Router Configuration and Troubleshooting",
          value:
            "Network / Connectivity / Router Configuration and Troubleshooting",
        },
        {
          label: "VPN access and Setup Issues",
          value: "Network / Connectivity / VPN access and Setup Issues",
        },
        {
          label:
            "Network Security Vulnerabilities (Firewall and Malware Protection)",
          value:
            "Network / Connectivity / Network Security Vulnerabilities (Firewall and Malware Protection)",
        },
        {
          label: "Other Network / Connectivity Issues",
          value: "Network / Connectivity / Other Network / Connectivity Issues",
        },
      ],
    },
    {
      label: "Laptop",
      value: "Laptop",
      subOptions: [
        {
          label: "Laptop is not starting",
          value: "Laptop / Laptop is not starting",
        },
        {
          label: "Laptop is overheating",
          value: "Laptop / Laptop is overheating",
        },
        {
          label: "Laptop is shutting down automatically",
          value: "Laptop / Laptop is shutting down automatically",
        },
        {
          label: "Laptop is very slow / lagging",
          value: "Laptop / Laptop is very slow / lagging",
        },
        {
          label: "OS not booting (Blue Screen of Death or Black Screen)",
          value:
            "Laptop / OS not booting (Blue Screen of Death or Black Screen)",
        },
        { label: "Display Issue", value: "Laptop / Display Issue" },
        {
          label: "Issue in installing / uninstalling a program",
          value: "Laptop / Issue in installing / uninstalling a program",
        },
        {
          label: "Storage / Data Issue",
          value: "Laptop / Storage / Data Issue",
        },
        {
          label: "Peripheral Device Issue (mouse etc.)",
          value: "Laptop / Peripheral Device Issue (mouse etc.)",
        },
        {
          label: "Security and Privacy Issue",
          value: "Laptop / Security and Privacy Issue",
        },
        { label: "Battery Issue", value: "Laptop / Battery Issue" },
        { label: "User Account Issue", value: "Laptop / User Account Issue" },
        {
          label: "Backup & Recovery Issue",
          value: "Laptop / Backup & Recovery Issue",
        },
      ],
    },
    {
      label: "Printer",
      value: "Printer",
      subOptions: [
        {
          label: "Printer not detected by the Computer / Laptop",
          value: "Printer / Printer not detected by the Computer / Laptop",
        },
        {
          label: "Printing Quality Issues",
          value: "Printer / Printing Quality Issues",
        },
        {
          label: "Paper Jam inside Printer",
          value: "Printer / Paper Jam inside Printer",
        },
        {
          label: "Paper not Feeding / multiple feeding papers",
          value: "Printer / Paper not Feeding / multiple feeding papers",
        },
        {
          label: "Slow Printing over Network",
          value: "Printer / Slow Printing over Network",
        },
      ],
    },
    {
      label: "Desktop",
      value: "Desktop",
      subOptions: [
        {
          label: "Desktop is not starting",
          value: "Desktop  Desktop is not starting",
        },
        {
          label: "Desktop is very slow",
          value: "Desktop   Desktop is very slow",
        },
        { label: "Hardware Issues", value: "Desktop  Hardware Issues" },
        {
          label: "Desktop is overheating",
          value: "Desktop  Desktop is overheating",
        },
        {
          label: "Desktop is shutting down automatically",
          value: "Desktop  Desktop is shutting down automatically",
        },
        {
          label: "OS not booting (Blue Screen of Death or Black Screen)",
          value:
            "Desktop  OS not booting (Blue Screen of Death or Black Screen)",
        },
        {
          label: "Missing or Corrupt Drivers",
          value: "Desktop  Missing or Corrupt Drivers",
        },
        { label: "Display Issue", value: "Desktop  Display Issue" },
        {
          label: "Issue in installing / uninstalling a program",
          value: "Desktop  Issue in installing / uninstalling a program",
        },
        {
          label: "Storage / Data Issue",
          value: "Desktop  Storage / Data Issue",
        },
        {
          label: "Peripheral Device Issue (mouse etc.)",
          value: "Desktop  Peripheral Device Issue (mouse etc.)",
        },
        {
          label: "Security and Privacy Issue",
          value: "Desktop  Security and Privacy Issue",
        },
        { label: "User Account Issue", value: "Desktop  User Account Issue" },
        {
          label: "Backup & Recovery Issue",
          value: "Desktop  Backup & Recovery Issue",
        },
      ],
    },
    {
      label: "CCTV Camera",
      value: "CCTV Camera",
      subOptions: [
        {
          label: "Camera not working",
          value: "CCTV Camera / Camera not working",
        },
        {
          label: "Camera has become loose / hanging",
          value: "CCTV Camera /  Camera has become loose / hanging",
        },
        {
          label: "Camera not detected by the system",
          value: "CCTV Camera / Camera not detected by the system",
        },
        {
          label: "Low-resolution Video Output",
          value: "CCTV Camera / Low-resolution Video Output",
        },
        {
          label: "Night Vision not working properly",
          value: "CCTV Camera / Night Vision not working properly",
        },
        {
          label: "Frequent disconnections or downtime",
          value: "CCTV Camera / Frequent disconnections or downtime",
        },
        {
          label: "Ethernet cable or power supply failure in wired cameras",
          value:
            "CCTV Camera / Ethernet cable or power supply failure in wired cameras",
        },
        { label: "Recording Issues", value: "CCTV Camera  Recording Issues" },
        {
          label: "Power Supply Issues",
          value: "CCTV Camera / Power Supply Issues",
        },
        { label: "Storage Issues", value: "CCTV Camera  Storage Issues" },
        {
          label: "Unauthorized access to the CCTV system",
          value: "CCTV Camera / Unauthorized access to the CCTV system",
        },
      ],
    },
    {
      label: "Software Issue",
      value: "Software Issue",
      subOptions: [
        {
          label: "Operating System Crashed",
          value: "Software Issue / Operating System Crashed",
        },
        {
          label: "Software Incompatibility (Versions not supported)",
          value:
            "Software Issue / Software Incompatibility (Versions not supported)",
        },
        {
          label: "Application Crashed (unable to open/run apps)",
          value:
            "Software Issue / Application Crashed (unable to open/run apps)",
        },
        {
          label: "Software Updates & Patches (Installation Failure)",
          value:
            "Software Issue / Software Updates & Patches (Installation Failure)",
        },
        {
          label: "License and Activation Issues",
          value: "Software Issue / License and Activation Issues",
        },
      ],
    },
    {
      label: "IT Security Issue",
      value: "IT Security Issue",
      subOptions: [
        {
          label: "Virus / Malware Infections",
          value: "IT Security Issue / Virus / Malware Infections",
        },
        {
          label: "Phishing Attacks",
          value: "IT Security Issue / Phishing Attacks",
        },
        {
          label: "Unauthorized Access",
          value: "IT Security Issue / Unauthorized Access",
        },
      ],
    },
    {
      label: "Cloud Service Issue",
      value: "Cloud Service Issue",
      subOptions: [
        {
          label: "Data Synchronization Issues",
          value: "Cloud Service Issue / Data Synchronization Issues",
        },
        {
          label: "Backup Failures",
          value: "Cloud Service Issue / Backup Failures",
        },
        {
          label: "Account Configuration Issue",
          value: "Cloud Service Issue / Account Configuration Issue",
        },
      ],
    },
    {
      label: "Email & Communication Issue",
      value: "Email & Communication Issue",
      subOptions: [
        {
          label: "Unable to send  / receive Email",
          value:
            "Email & Communication Issue / Unable to send  / receive Email",
        },
        {
          label: "Spam Filtering Issues",
          value: "Email & Communication Issue / Spam Filtering Issues",
        },
        {
          label: "Calendar Syncing Issues",
          value: "Email & Communication Issue / Calendar Syncing Issues",
        },
        {
          label: "Attachment Size Limit Issue",
          value: "Email & Communication Issue / Attachment Size Limit Issue",
        },
      ],
    },
    {
      label: "User Account & Access Issue",
      value: "User Account & Access Issue",
      subOptions: [
        {
          label: "Password reset and recovery",
          value: "User Account & Access Issue / Password reset and recovery",
        },
        {
          label: "Account lockouts",
          value: "User Account & Access Issue / Account lockouts",
        },
        {
          label: "Single sign-on issues",
          value: "User Account & Access Issue / Single sign-on issues",
        },
      ],
    },

    {
      label: "IT Support Services",
      value: "IT Support Services",
      subOptions: [
        {
          label: "Remote Desktop Support",
          value: "IT Support Services / Remote Desktop Support",
        },
        {
          label: "Ticket Resolution Delay",
          value: "IT Support Services / Ticket Resolution Delay",
        },
        {
          label: "Hardware Replacement",
          value: "IT Support Services / Hardware Replacement",
        },
      ],
    },

    {
      label: "Backup & Recovery Issues",
      value: "Backup & Recovery Issues",
      subOptions: [
        {
          label: "Backup Schedule Failures",
          value: "Backup & Recovery Issues / Backup Schedule Failures",
        },
        {
          label: "Data Recovery Problems",
          value: "Backup & Recovery Issues / Data Recovery Problems",
        },
        {
          label: "Storage Capacity Limits",
          value: "Backup & Recovery Issues / Storage Capacity Limits",
        },
      ],
    },

    { label: "Other", value: "Other" },
  ];

export default options;