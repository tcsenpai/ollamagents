#!/bin/bash

CURRENT_DIR=$(pwd)
echo "Please grant sudo access to install ollamagents in /usr/local/bin"
sudo -v || exit 1
echo "Working in $CURRENT_DIR"
yarn install || exit 1
echo "#!/bin/bash" >ollamagents
echo "cd $CURRENT_DIR" >>ollamagents
echo "yarn start" >>ollamagents
chmod +x ollamagents
sudo mv ollamagents /usr/local/bin/
echo "Done!"
