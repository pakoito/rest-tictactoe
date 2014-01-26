def run match
  system("cls")
  system("rspec specification")
  puts "\ndone. [#{match}]"
end

watch ('.*.rb$') { |md| run md[0] }
watch ('.*.js$') { |md|
  sleep 2.0
  run md[0]
}
