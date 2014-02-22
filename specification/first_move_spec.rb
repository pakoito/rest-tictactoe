require './specification/spec_helper.rb'

describe "making a move in tic tac toe" do
  include Helper

  before(:each) do
    @player1 = HttpClient.new
    @player1.set_host "localhost:3000"

    @player2 = HttpClient.new
    @player2.set_host "localhost:3000"

    @player1.post "/reset"
  end

  specify "player one makes a move" do
    register_user @player1, "bobby", "password"
    register_user @player2, "timmy", "password"

    create_game @player1

    @player2.post open_games(@player2)["games"].first["join"]["url"]
  end
end
