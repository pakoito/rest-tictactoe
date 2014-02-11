require './http_client.rb'
require 'json'
require 'yaml'
require 'rspec'

RSpec.configure do |config|
  config.filter_run :focus => true
  config.run_all_when_everything_filtered = true
end

module Helper
  def register_user client, username, password
    client.authorization = encode(client, username, password)

    client.post "/register"
  end

  def encode client, username, password
    client.get(root(client)["encode"]["url"], {
      :username => username,
      :password => password
    })["result"]
  end

  def create_game client
    client.post root(client)["newgame"]["url"]
  end

  def open_games client
    client.get(root(client)["opengames"]["url"])
  end

  def root client
    client.get "/"
  end

  def print json
    if json["error"]
      puts json ["error"]
    else
      puts json
      puts JSON.pretty_generate(json)
    end
  end
end

