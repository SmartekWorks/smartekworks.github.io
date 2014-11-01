Setup SWAT Server
===

We are offering both SWAT cloud service and SWAT package. Though you just need an account for using SWAT cloud service, you need to setup SWAT pacakge to you private server before you can use it.

Requirements
---

|         | Requirements
| ------- | -----------
| CPU     | 2.2 GHz (Single Core) or above
| Memory  | 3072 MB (Windows), 2048 MB (Linux)
| OS      | Windows 7 or above, Mac OS X 10.6 or above, Ubuntu 10.4 or above, Redhat 5 or above (Other linux distribution may also work)
| Others  | You must have Java SDK 7 installed on your target desktop/VM. 


Installation
---

1. Download a packaged release of the latest SWAT.
2. Setup the JAVA Home and path in your environment settings. For example
In Windows
```
JAVA_HOME=C:\Program Files\Java\jdk1.7.0_45
Path=%JAVA_HOME%\bin
```
In Linux
```
JAVA_HOME=/home/ubuntu/jdk1.7.0_45
PATH=/home/ubuntu/jdk1.7.0_45/bin
```
3. Extract the swat_xxx.zip file to the installation directory on your target computer.
4. If you setup SWAT on platforms other than Windows, you should ensure that the user account running the application must have write permission on the subdirectories.
5. After server configuration, you can use following commands to start and stop SWAT server.
In Windows
```
<installation directory>/bin/startup.bat
<installation directory>/bin/shutdown.bat
```
In Linux
```
<installation directory>/bin/startup.sh
<installation directory>/bin/shutdown.sh
```

Configuration
---

#### Server Configuration

As most of the settings can be set from SWAT UI, you only need to config the IP in configuration file through which you can access to SWAT server.

Note: You do not need to do the following configuration if you plan to use SWAT server standalone.

1. Open `<installation directory>/bin/setenv.bat` or `<installation directory>/bin/setenv.sh` in text editor.
2. Locate the part `-DswatServer=‘http://127.0.0.1:8080’` and change the `127.0.0.1` to the actual server address. 

#### Account Configuration

You need to start the SWAT server and do the remaining account settings in your browser.

Note: Please use the Internet Explorer 10 or above, latest Chrome, latest Firefox and latest Safari to view SWAT service.

1. Execute `<installation directory>/bin/startup.bat` or `<installation directory>/bin/startup.sh` and wait for server startup complete.
2. Access `http://<IP_ADDRESS>:8080` in your browser.
3. Login with the initial user/password (`manager`/`12345678`).
4. Visit **Account Settings** page through menu *Management > Account Settings*, and you will find the information of the account.
5. Finish the following configuration.
 * Click the **Update** button next to **Plan Information** and input your license code before using SWAT.
 * Select **Internal Language** for language SWAT will use in execution and parsing. (The UI language will be switched according to your browser's preference.)
 * Change the **Timezone** and other settings if you need. (They are explained in [User Guide](guide_start.md), [Setup Execution Services](setup_execservices.md) and [Setup Tools and Integrations](setup_tools.md))
6. Visit **User Profile** page through menu *manager > Edit Profile*, and change the password. 
7. You may also setup a new user in **User Management** page through menu *Management > Users*.

Upgrade
---

Note: SWAT support upward upgrade only, e.g., from v1.5.0 to v1.6.0. Downgrade is NOT allowed.

1. Download the upgrade package for the specific SWAT version.
2. Unzip the package and copy the contents inside to the `update` folder in the SWAT root directory. If the `update` folder does not exist, please create it manually.
3. Run the update batch scripts to upgrade SWAT service.
In Windows
```
<installation directory>/update/update.bat
```
In Linux
```
<installation directory>/update/update.sh
```
4. In case the update progress fails, you can run the rollback batch scripts to restore the SWAT service.
In Windows
```
<installation directory>/update/rollback.bat
```
In Linux
```
<installation directory>/update/rollback.sh
```

Next Steps
----

After the SWAT server setup, you need to setup [Local Execution Services](setup_execservices.md#Setup_Local_Execution_Server) before you can run you scenario.

You are strongly recommended to finish the [User Guide](guide_start.md) before starting working on your own web application.
