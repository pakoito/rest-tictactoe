require 'net/http'
require 'json'

class HttpClient
  attr_accessor :authorization

  def set_host host
    @host = host
  end

  def construct_uri(path)
    URI.parse("http://#{@host}" + path)
  end

  def post path, payload = { }
    uri = construct_uri path 
    http = Net::HTTP.new(uri.host, uri.port)
    req = Net::HTTP::Post.new(uri.path)
    req.body = payload.to_json
    req["Authorization"] = "Basic #{@authorization}" if @authorization
    req["Content-Type"] = "application/json"
    response = http.request(req)
    JSON.parse(response.body)
  end

  def get path, querystring = { }
    querystring.keys.each do |k| 
      path.gsub!(":#{k}", querystring[k])
    end

    uri = construct_uri path
    http = Net::HTTP.new(uri.host, uri.port)
    req = Net::HTTP::Get.new(uri.path)
    if @authorization
      puts "authorization being sent too"
      req["Authorization"] = "Basic #{@authorization}" 
      req["Content-Type"] = "application/json"
    end
    response = http.request(req)
    JSON.parse(response.body)
  end
end
