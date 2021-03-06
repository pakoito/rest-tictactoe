require './specification/spec_helper.rb'

describe "join game" do
  include Helper

  before(:each) do
    @player1 = HttpClient.new
    @player1.set_host "localhost:3000"

    @player2 = HttpClient.new
    @player2.set_host "localhost:3000"

    @player1.post "/reset"

    register_user @player1, "bobby", "password"
    register_user @player2, "timmy", "password"

    create_game @player1

    join_game @player2, open_games(@player2)["games"].first
  end

  specify "game is removed from open game list" do
    expect(open_games(@player2)["games"].count).to eq(0)
  end

  specify "games show up in their 'inprogess' queues" do
    expect(inprogress_games(@player1)["games"].count).to eq(1)
    expect(inprogress_games(@player2)["games"].count).to eq(1)
  end
end
