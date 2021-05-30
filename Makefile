migrate:
	npx sequelize-cli db:migrate --env development
rollback:
	npx sequelize-cli db:migrate:undo
