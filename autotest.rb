def run
  system("cls")
  system("rspec specification")
  puts "\ndone."
end

watch ('.*.rb$') { run }
watch ('.*.js$') {
  sleep 2.0
  run
}
