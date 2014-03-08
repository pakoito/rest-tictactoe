require './specification/spec_helper.rb'

describe "making a move in tic tac toe" do
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

  specify "each player makes an alternating move", :focus => true do
    expect(has_turn(@player1)).to eq(true)
    expect(has_turn(@player2)).to eq(false)

    make_move(@player1, "topleft")

    expect(has_turn(@player1)).to eq(false)
    expect(has_turn(@player2)).to eq(true)

    make_move(@player2, "topmiddle")

    expect(has_turn(@player1)).to eq(true)
    expect(has_turn(@player2)).to eq(false)
  end

  def make_move(player, location) 
    player.post first_inprogress_game(player)["turn"][location]["url"]
  end

  def first_inprogress_game(player) 
    inprogress_games(player)["games"][0]
  end

  def has_turn(player)
    !!first_inprogress_game(player)["turn"]
  end
end
