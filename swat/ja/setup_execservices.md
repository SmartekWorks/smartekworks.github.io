���s�T�[�r�X�̃Z�b�g�A�b�v
===

SWAT�͂������I�ɃV�i���I���쐬�ł��邾���łȂ��A�l�X�ȃv���b�g�t�H�[����Ń��[�J�����s�T�[�r�X�ƃN���E�h���s�T�[�r�X��񋟂��Ă܂��B

���[�J�����s�T�[�o�[�̃Z�b�g�A�b�v
---

#### �����

|         | �����
| ------- | -----------
| CPU     | 2.2 GHz (Single Core) or above
| Memory  | 2048 MB
| OS      | Windows XP�ȏ�, Mac OS X 10.6�ȏ�, Ubuntu 10.4�ȏ�(����linux�œ��삷�邩�͕ʓr���؂��K�v)
| Browser | Internet Explorer 6�ȏ�, �ŐV��Firefox, �ŐV��Chrome, �ŐV��Safari
| Others  | desktop��VM���Java�@SDK7�̃C���X�g�[�����K�v�B 

#### �C���X�g�[���菇

1. SWAT�T�[�r�X�̃T�[�r�X�ݒ肩�烍�[�J�����s����I�сA**���[�J�����s���ꗗ**��ʂ�\�������܂��B
2. �E���̃{�^�����N���b�N���A**���[�J�����s��**��I�����܂��B
3. �ݒ�����m�F���āA�u�_�E�����[�h�v���N���b�N����ƁAzip�t�@�C����`WAAS-xxx.zip`�����[�J���R���s���[�^�Ƀ_�E�����[�h����܂��B
4. �^�[�Q�b�g�R���s���[�^��̃C���X�g�[���f�B���N�g����zip�t�@�C�����𓀂��܂�.
6. ���L�͂ɏ]���ăC���X�g�[���f�B���N�g���̉���`account.ini`�ݒ�t�@�C����ύX���܂��B
7. ���[�J�����s�T�[�o�[�𗧂��グ��̂́A�C���X�g�[���f�B���N�g������`startup.bat` (`startup.sh` on Mac or Linux)�����s���܂��B 
8. �T�[�r�X�ݒ�̃��[�J�����s����I�сA**���[�J�����s���ꗗ���** ��ʂ��ēx�\�������A���[�J�����s�T�[�o���o�^����Ă��邱�Ƃ��m�F�ł��܂��B
9. ���[�J�����s�T�[�o�[���~������ɂ́A�C���X�g�[���f�B���N�g������`shutdown.bat` (`shutdown.sh` on Mac or Linux)�����s���܂��B

#### �ݒ�t�@�C��

�ȉ��̏͂ɏ]���ăC���X�g�[���f�B���N�g���̉���`account.ini`�̐ݒ�t�@�C����ύX

* `waasCode`: ���s�T�[�o�[�̃R�[�h�ł��B����̎��s�T�[�o�[�ŃV�i���I�����s���邽�߂̎��s�̍쐬���ɃR�[�h���w�肷�邱�Ƃ��ł��܂��B�A���t�@�x�b�g�Ɛ����̑g������16�����ȉ��Ŏw�肵�܂��B���̋@�\������Ȃ��ꍇ�͐ݒ肷��K�v�͂���܂���B 
* `privateMode`: �s�����**WaasCode**�Ŏ��s�^�X�N���󂯓���邩�ǂ��������߂�̂�`true`��`false`���w�肵�܂��B �f�t�H���g�l`false`�ł��B���s�T�[�o�[�� `waasCode`��ݒ肵�Ȃ��ꍇ�A�l�͖�������܂��B
* `serverUrl`: SWAT�A�J�E���g�̃T�[�o�[URL�ł��B**�A�J�E���g�ݒ�**��ʂ��炱�̏�����肷�邱�Ƃ��ł��܂��B
* `apiKey`: SWAT�A�J�E���g��API�L�[�ł��B **�A�J�E���g�ݒ�**��ʂ��炱�̏�����肷�邱�Ƃ��ł��܂��B
* `secretKey`: SWAT�A�J�E���g�̃V�[�N���b�g�L�[�ł��B**�A�J�E���g�ݒ�**��ʂ��炱�̏�����肷�邱�Ƃ��ł��܂��B
* `swatProxy.enable`: SWAT�T�[�r�X�֐ڑ����邽�߂Ƀv���L�V�[���g�����ǂ��������肷��̂�`true`��`false`���w�肵�܂��B�f�t�H���g�l��`false`�ł��B
* `swatProxy.host`: �v���L�V�[�̃z�X�g�ł��B`swatProxy.enable`��`false`�̏ꍇ�A��������܂��B
* `swatProxy.port`: �v���L�V�[�̃|�[�g�ł��B �������w�肵�܂��B`swatProxy.enable`��`false`�̏ꍇ�A��������܂��B
* `swatProxy.username`: �v���L�V�[��username�ł��B`swatProxy.enable` ��`false`�̏ꍇ�A��������܂��B
* `swatProxy.password`: �v���L�V�[��password�ł��B`swatProxy.enable`��`false`�̏ꍇ�A��������܂��B
* `execProxy.enable`: �u���E�U���s���Ƀv���L�V�[���g�����ǂ��������߂�̂�`true`��`false`�Ŏw�肵�܂��BSWAT�́A���s���̃u���E�U�F�؃_�C�A���O���������Ƃ��ł��܂���B���[�U�l�[���ƃp�X���[�h�Ȃ��Ńv���L�V�[���g�����Ƃ��ł��܂��B�f�t�H���g�l��`false`�ł��B
* `execProxy.host`: �v���L�V�[��host�ł��B`execProxy.enable`��`false`�̏ꍇ�A��������܂��B
* `execProxy.port`: �v���L�V�[��port�ł��B`execProxy.enable`��`false`�̏ꍇ�A�������ꂍ���B
* `driverParallelization`:���[�J�����s�T�[�o�ŋ����ꂽ�ő����Z�b�V�����ł��B�R���s���[�^���IE�̃Z�b�V����������s���Ă���ƁA���̃P�[�X�ł͒l�͖�������܂��B
* `downloadDir`: �u���E�U�̃f�t�H���gdownload�f�B���N�g���[�ł��B�l��ݒ肵�Ȃ��ƁA�V�X�e���I�y���[�V������**Obtain Download**�͎g�����Ƃ��ł��Ȃ��B `C:\\Downloads`�̂悤��Windows�Ń_�u���o�b�N�X���b�V���������Ă��������B
* `firefoxProfile`: �e�X�g�u���E�U���N�����邱�Ƃ�]�ލۂ�Firefox profile�̃p�X�ł��B���ʂȐݒ��ǉ������AFirefox��Ńe�X�g�����������ɕ֗��ł��B `C:\\Downloads`�̂悤��Windows�Ń_�u���o�b�N�X���b�V���������Ă��������B

#### �m�[�g

* Windows 8�Ń��[�J�����s�T�[�o�[�𗧂��グ��Ƃ��A"Could not open/create prefs root node Software\JavaSoft\Prefs at root 0x80000002. Windows RegCreateKeyEx(...) returned error code 5."��warning message���m�F���܂��B ���ꂪ���s�ɉe����^���邱�Ƃ͂���܂���̂ŁA���̃��b�Z�[�W�𖳎����������B �܂��A���W�X�g����`HKEY_LOCAL_MACHINE\Software\JavaSoft\Prefs`��ǉ����邱�Ƃɂ��A���̃��b�Z�[�W���폜���邱�Ƃ��ł��܂��B


#### ����

���s�ɉe����^����\���̂���u���E�U�̐ݒ�͑������߁AOS��u���E�U�̐ݒ�͊ȒP�ȍ�Ƃł͂���܂���B�����̃v���Z�X���ȒP�ɂ��邢�����̒�Ă����܂��B

* �N���E�h���s�T�[�r�X���g���AOS��u���E�U�̐ݒ�̂قƂ�ǂ��v���o�C�_�ɂ�菈�����܂��B
* ���[�J�����̐ݒ���@�ɂ��Ă̏��A�b�v�f�[�g��p�ɂɃZ�b�V�������m�F���������B
* �ŐV�o�[�W�����̃��[�J�����s�T�[�o�[���A�b�v�f�[�g���A���[�J�����s�T�[�o�ɂ�������s�̖��Ɋւ���������Ȃ���Ă܂��B
* Selenium Web Driver�̏����C���^�[�l�b�g�ŒT���܂��B����͌���SWAT�̃��C���̎��s�G���W��������ł��B

BrowserStack�T�[�r�X�̐ݒ�
---

�N���E�h�T�[�r�X�ŁASWAT�̓p�u���b�N���s�T�[�r�X�Ƃ���[BrowserStack](http://www.browserstack.com)���T�|�[�g���܂��B BrowserStack�T�[�r�X���g���ɂ́ABrowserStack�A�J�E���g���擾���A�ŏ��̎������v�������w������K�v������܂��B (BrowserStack�̃p�[�g�i�[�Ƃ��āA���Ђ͎x������s�ƈꎞ�T�|�[�g������񋟂��Ă��܂��B) ���̌�A�T�[�r�X�𗘗p����O��SWAT���BrowserStack�A�J�E���g��ݒ肵�܂��B 

�q���g�FBrowserStack�T�[�r�X�͎��p�A�J�E���g���g�p���Ă���ꍇ�A���ɐݒ肳��A�������̓T�u�X�N���v�V�������w�����܂��B

1. �T�[�r�X�ݒ�̃A�J�E���g�ݒ��I�сA**�A�J�E���g�ݒ�**��ʂ�\�����܂��B
2. BrowserStack�A�J�E���g���̃R���t�B�O���[�V�����������**�N���E�h���s**�t�B�[���h�ɉ��L�̈�Ƃ��ē��͂��܂��B 
```json
{
	"browserstack":{
		"enable":true, 
		"username":"Demo", 
		"accesskey":"abcdefgabcdefg", 
		"parallelization":2
	}
}
```

#### �R���t�B�O���[�V����������

�R���t�B�O���[�V����������͉��L���[����JSON�}�b�v�ł��B

*`"browserstack"`�̃L�[���g���A�l�Ƃ��ĉ��L�L�[�̃R���t�B�O���[�V�����}�b�v�ł��B
 * `"enable"`: Use �T�[�r�X���g�����ǂ��������߂�̂�`true`��`false`���g���܂��B �f�t�H���g�l��`false`�ł��B
 * `"username"`: BrowserStack�A�J�E���g��username�ł��B
 * `"accesskey"`: BrowserStack�A�J�E���g��accesskey�ł��B
 * `"parallelization"`: �ő啽�s�Z�b�V�����́ABrowserStack�T�u�X�N���v�V�����ŋ����ꂽ���̂ł��B
 * `"local"`: ���[�J���e�X�g��BrowserStack���g�����ǂ��������߂�ɂ�`true`��`false`���g���܂��B�f�t�H���g�l��`false`�ł��B
 
�m�[�g�F�A�J�E���g�����擾������@�⃍�[�J���e�X�g�̎g�p���@��BrowserStack�̃h�L�������g���Q�Ƃ��Ă��������B

���[�J�����̐ݒ�
---

�ł��\���̍������ɏo��ɂ͎��̒ʂ�ł��B

#### Internet Explorer

���s���s���ɂ͉��L�ݒ肪�K�v�ł��B

* Windows VISTA��7��IE 7�ȍ~���g�p����ꍇ�A�����l�ɂȂ�悤�Ƀ]�[�����Ƃɕی샂�[�h�̐ݒ������K�v������܂��B�l�́A���ׂẴ]�[���̂��߂ɓ����ł������A�I���܂��̓I�t�ɂ��邱�Ƃ��ł��܂��B �ی샂�[�h��ݒ肷��ɂ́A[�c�[��]���j���[���� "�C���^�[�l�b�g�I�v�V����..."��I�����A[�Z�L�����e�B]�^�u���N���b�N���Ă��������B�e�]�[���ɂ��ẮA�u�ی샂�[�h��L���ɂ���v�ƋL���ꂽ�^�u�̉����ɂ���`�F�b�N�{�b�N�X������܂��B
* ����ɁA�u�������ꂽ�ی샂�[�h�uIE10�ȍ~�̂��߂ɖ����ɂ���K�v������܂��B���̃I�v�V�����́A[�C���^�[�l�b�g�I�v�V����]�_�C�A���O��[�ڍאݒ�]�^�u�Ɋ܂܂�Ă��܂��B
* �l�C�e�B�u�̃}�E�X�C�x���g�����������W�ɐݒ�ł���悤�ɁA�u���E�U�̃Y�[�����x����100���ɐݒ肳��Ȃ���΂Ȃ�܂���B
* IE11�݂̂ł́A�h���C�o��Internet Explorer�̃C���X�^���X�ւ̐ڑ����ێ��ł���悤�ɁA�^�[�Q�b�g�R���s���[�^��̃��W�X�g���G���g����ݒ肷��K�v������܂��B reg file�͂�������_�E�����[�h�ł��܂��B [here](http://www.smartekworks.com/tools/ie11-get-window-handles.zip).
* If the website uses basic authentication, you can use the URL in the format like `http://<username>:<password>@yourdomain`. However, IE does not support this type of URL by default. You have to set a registry entry on the target computer. You can download the reg file [here](http://www.smartekworks.com/tools/ie-enable-basic-auth.zip)

You should also take care of the following points in execution:

* As the InternetExplorerDriver uses so-called "native", or OS-level events to perform mouse and keyboard operations in the browser, you have to stop other tasks when using the IE driver for execution to ensure no to interfere the execution.
* Screenshot cannot be captured normally in execution during the period that you use remote desktop (RDP) to connect execution environment, which is common when you use VM for execution. You also have to disconnect the RDP connect normally before execution.
* InternetExplorerDriver uses current user's settings and data of IE, which means that cookies from one execution will remains in the next execution. You need to set IE to delete the context data when exit in *Internet Options > General* to ensure the execution starts with a clean context.

#### Windows Firewall

If you execute the scenario for the first on Windows with Windows Firewall enabled, there may be a dialog shown to ask whether allow the communication of `IEDriverServer.exe` or `chromedriver.exe`. Please permit the communication. You can also add the permission manually in your windows firewall settings.
