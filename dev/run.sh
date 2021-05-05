#!/usr/bin/env bash

cd "$(dirname $0)"
CMD="$1"

case "$CMD" in
  "init-db")
    cat "$(pwd)"/../sql/testData.sql | docker exec -i -e MYSQL_PWD=password test_1-mysql mysql --default-character-set=utf8 --host=127.0.0.1 --database=testdb --user=user
    ;;
   "clear-db")
    cat "$(pwd)"/../sql/clearData.sql | docker exec -i -e MYSQL_PWD=password test_1-mysql mysql --default-character-set=utf8 --host=127.0.0.1 --database=testdb --user=user
    ;;
  "start-docker")
    docker-compose -f ./docker/docker-compose.yml up -d
    ;;
  "stop-docker")
    docker-compose -f ./docker/docker-compose.yml down
    ;;
  "clean-docker-volume")
    docker-compose -f ./docker/docker-compose.yml down && rm -rf ./docker/.docker
    ;;
  *)
    >&2 echo "usage $0 swagger-editor | start-docker |  stop-docker | clean-docker-volume | mysql-client | init-db | clear-db | mock-server"
    ;;
esac