PORT=27017
sudo systemctl start docker
PID=$(sudo lsof -t -i:$PORT)

if [ ! -z "$PID" ]; then
    echo "Le port $PORT est déjà utilisé par le processus $PID. Arrêt du processus."
    sudo kill -9 $PID
else
    echo "Le port $PORT est libre."
fi
sudo docker compose build        \
&& sudo docker compose down      \
&& sudo docker compose up --build
