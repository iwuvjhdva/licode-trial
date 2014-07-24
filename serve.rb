require 'sinatra'
require 'haml'

get '/' do
    haml :index
end

get '/initiator' do
    haml :initiator
end

get '/participant' do
    haml :participant
end
