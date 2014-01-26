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
    auth = client.get(root(client)["encode"]["url"], {
      :username => username,
      :password => password
    })["result"]

    client.authorization = auth

    client.post "/register"
  end

  def create_game client
    client.post root(client)["newgame"]["url"]
  end

  def open_games client
    client.get(root(client)["opengames"]["url"])["games"]
  end

  def root client
    client.get "/"
  end

  def print json
    if json["error"]
      puts json ["error"]
    else
      puts JSON.pretty_generate(json)
    end
  end
end

